const axios = require('axios');
const WhatsappTemplate = require('../model/whatsapp_template_model');
const { uploadToS3 } = require('../file_uploadImage');

const VARIABLE_REGEX = /\{\{(\d+)\}\}/g;

function extractVariableNumbers(body) {
    const numbers = [];
    let match;
    const regex = new RegExp(VARIABLE_REGEX);
    while ((match = regex.exec(body || '')) !== null) {
        numbers.push(parseInt(match[1], 10));
    }
    return numbers;
}

function validateTemplatePayload(payload) {
    const errors = [];

    if (!payload.templateName || !payload.templateName.trim()) {
        errors.push('Template name is required');
    }
    if (!payload.category || !['MARKETING', 'UTILITY', 'AUTHENTICATION'].includes(payload.category)) {
        errors.push('A valid category is required');
    }
    if (!payload.language || !payload.language.trim()) {
        errors.push('Language is required');
    }
    if (!payload.body || !payload.body.trim()) {
        errors.push('Body cannot be empty');
    } else if (payload.body.length > 1024) {
        errors.push('Body must not exceed 1024 characters');
    }
    if (payload.footer && payload.footer.length > 60) {
        errors.push('Footer must not exceed 60 characters');
    }

    const headerType = payload.headerType || 'NONE';
    if (headerType === 'TEXT') {
        if (!payload.headerText || !payload.headerText.trim()) {
            errors.push('Header text is required when header type is Text');
        } else if (payload.headerText.length > 60) {
            errors.push('Header text must not exceed 60 characters');
        }
    } else if (headerType === 'IMAGE' || headerType === 'VIDEO') {
        if (!payload.headerMediaUrl) {
            errors.push(`Header ${headerType.toLowerCase()} must be uploaded`);
        }
    } else if (headerType === 'DOCUMENT') {
        if (!payload.headerMediaUrl || !payload.headerMediaUrl.trim()) {
            errors.push('Header document URL is required');
        }
    }

    const variableNumbers = extractVariableNumbers(payload.body);
    if (variableNumbers.length > 0) {
        const uniqueSorted = [...new Set(variableNumbers)].sort((a, b) => a - b);
        const isContiguousFromOne = uniqueSorted.every((n, idx) => n === idx + 1);
        if (!isContiguousFromOne) {
            errors.push('Variables must be sequential starting from {{1}} with no gaps');
        }
        const firstSeenOrder = [];
        const seen = new Set();
        for (const n of variableNumbers) {
            if (!seen.has(n)) {
                seen.add(n);
                firstSeenOrder.push(n);
            }
        }
        const isAscending = firstSeenOrder.every((n, idx) => n === idx + 1);
        if (isContiguousFromOne && !isAscending) {
            errors.push('Variables must appear in ascending order in the body');
        }
    }

    const buttons = payload.buttons || [];
    if (buttons.length > 10) {
        errors.push('A template cannot have more than 10 buttons');
    }
    buttons.forEach((btn, idx) => {
        const label = `Button ${idx + 1}`;
        if (!btn.type || !['QUICK_REPLY', 'CALL', 'WEBSITE', 'COPY_CODE', 'DYNAMIC_URL'].includes(btn.type)) {
            errors.push(`${label}: a valid type is required`);
            return;
        }
        if (btn.type === 'QUICK_REPLY' && (!btn.text || !btn.text.trim())) {
            errors.push(`${label}: quick reply text is required`);
        }
        if (btn.type === 'CALL' && (!btn.phoneNumber || !btn.phoneNumber.trim())) {
            errors.push(`${label}: phone number is required`);
        }
        if ((btn.type === 'WEBSITE' || btn.type === 'DYNAMIC_URL') && (!btn.url || !btn.url.trim())) {
            errors.push(`${label}: URL is required`);
        }
        if (btn.type === 'COPY_CODE' && (!btn.exampleCode || !btn.exampleCode.trim())) {
            errors.push(`${label}: example code is required`);
        }
    });

    return { valid: errors.length === 0, errors, variableCount: variableNumbers.length > 0 ? Math.max(...variableNumbers) : 0 };
}

function buildMetaComponents(template) {
    const components = [];

    if (template.headerType && template.headerType !== 'NONE') {
        const headerComponent = { type: 'HEADER', format: template.headerType };
        if (template.headerType === 'TEXT') {
            headerComponent.text = template.headerText;
        } else if (template.headerMediaUrl) {
            headerComponent.example = { header_handle: [template.headerMediaUrl] };
        }
        components.push(headerComponent);
    }

    components.push({ type: 'BODY', text: template.body });

    if (template.footer && template.footer.trim()) {
        components.push({ type: 'FOOTER', text: template.footer });
    }

    if (template.buttons && template.buttons.length > 0) {
        const buttons = template.buttons.map((btn) => {
            switch (btn.type) {
                case 'QUICK_REPLY':
                    return { type: 'QUICK_REPLY', text: btn.text };
                case 'CALL':
                    return { type: 'PHONE_NUMBER', text: btn.text || 'Call Now', phone_number: btn.phoneNumber };
                case 'WEBSITE':
                    return { type: 'URL', text: btn.text || 'Visit Website', url: btn.url };
                case 'DYNAMIC_URL':
                    return { type: 'URL', text: btn.text || 'Visit Website', url: btn.url, example: [btn.url] };
                case 'COPY_CODE':
                    return { type: 'COPY_CODE', example: btn.exampleCode };
                default:
                    return null;
            }
        }).filter(Boolean);
        components.push({ type: 'BUTTONS', buttons });
    }

    return components;
}

function buildSnapshot(doc, action) {
    return {
        snapshotAt: new Date(),
        action,
        templateName: doc.templateName,
        category: doc.category,
        language: doc.language,
        templateType: doc.templateType,
        headerType: doc.headerType,
        headerText: doc.headerText,
        headerMediaUrl: doc.headerMediaUrl,
        body: doc.body,
        footer: doc.footer,
        buttons: doc.buttons,
        status: doc.status
    };
}

function parseButtons(rawButtons) {
    if (!rawButtons) return [];
    if (Array.isArray(rawButtons)) return rawButtons;
    try {
        const parsed = JSON.parse(rawButtons);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        return [];
    }
}

exports.getTemplates = async (req, res) => {
    try {
        const { status, search } = req.query;
        const query = { isActive: true };
        if (status && status !== 'All') {
            query.status = status.toLowerCase();
        }
        if (search && search.trim()) {
            query.templateName = new RegExp(search.trim(), 'i');
        }
        const templates = await WhatsappTemplate.find(query).sort({ updatedDate: -1 });
        res.send({ status: 'success', message: 'Templates fetched', data: templates });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};

exports.getTemplateById = async (req, res) => {
    try {
        const template = await WhatsappTemplate.findById(req.params.id);
        if (!template) {
            return res.send({ status: 'error', message: 'Template not found' });
        }
        res.send({ status: 'success', message: 'Template fetched', data: template });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const payload = { ...req.body, buttons: parseButtons(req.body.buttons) };

        if (req.file) {
            const mediaUrl = await uploadToS3(req.file);
            payload.headerMediaUrl = mediaUrl;
            payload.headerMediaType = req.file.mimetype;
        }

        const validation = validateTemplatePayload(payload);
        if (!validation.valid) {
            return res.send({ status: 'error', message: validation.errors.join(', '), errors: validation.errors });
        }

        const existing = await WhatsappTemplate.findOne({
            templateName: new RegExp(`^${payload.templateName.trim()}$`, 'i'),
            isActive: true
        });
        if (existing) {
            return res.send({ status: 'error', message: 'A template with this name already exists' });
        }

        const newTemplate = new WhatsappTemplate({
            templateName: payload.templateName,
            category: payload.category,
            language: payload.language,
            templateType: payload.templateType || 'TEXT',
            headerType: payload.headerType || 'NONE',
            headerText: payload.headerText,
            headerMediaUrl: payload.headerMediaUrl,
            headerMediaType: payload.headerMediaType,
            body: payload.body,
            footer: payload.footer,
            buttons: payload.buttons,
            variableCount: validation.variableCount,
            status: 'draft',
            createdBy: payload.createdBy || req.user.userId,
        });
        newTemplate.versionHistory = [buildSnapshot(newTemplate, 'draft_save')];

        await newTemplate.save();
        res.send({ status: 'success', message: 'Template created', data: newTemplate });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const template = await WhatsappTemplate.findById(req.params.id);
        if (!template) {
            return res.send({ status: 'error', message: 'Template not found' });
        }

        const payload = { ...req.body, buttons: parseButtons(req.body.buttons) };

        if (req.file) {
            const mediaUrl = await uploadToS3(req.file);
            payload.headerMediaUrl = mediaUrl;
            payload.headerMediaType = req.file.mimetype;
        }

        const validation = validateTemplatePayload(payload);
        if (!validation.valid) {
            return res.send({ status: 'error', message: validation.errors.join(', '), errors: validation.errors });
        }

        const duplicate = await WhatsappTemplate.findOne({
            _id: { $ne: template._id },
            templateName: new RegExp(`^${payload.templateName.trim()}$`, 'i'),
            isActive: true
        });
        if (duplicate) {
            return res.send({ status: 'error', message: 'A template with this name already exists' });
        }

        template.templateName = payload.templateName;
        template.category = payload.category;
        template.language = payload.language;
        template.templateType = payload.templateType || template.templateType;
        template.headerType = payload.headerType || 'NONE';
        template.headerText = payload.headerText;
        template.headerMediaUrl = payload.headerMediaUrl !== undefined ? payload.headerMediaUrl : template.headerMediaUrl;
        template.headerMediaType = payload.headerMediaType || template.headerMediaType;
        template.body = payload.body;
        template.footer = payload.footer;
        template.buttons = payload.buttons;
        template.variableCount = validation.variableCount;
        template.updatedDate = new Date();
        template.versionHistory.push(buildSnapshot(template, 'draft_save'));

        await template.save();
        res.send({ status: 'success', message: 'Template saved', data: template });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};

exports.autoSaveTemplate = async (req, res) => {
    try {
        const template = await WhatsappTemplate.findById(req.params.id);
        if (!template) {
            return res.send({ status: 'error', message: 'Template not found' });
        }
        const payload = { ...req.body, buttons: parseButtons(req.body.buttons) };

        template.templateName = payload.templateName || template.templateName;
        template.category = payload.category || template.category;
        template.language = payload.language || template.language;
        template.templateType = payload.templateType || template.templateType;
        template.headerType = payload.headerType || template.headerType;
        template.headerText = payload.headerText;
        template.body = payload.body !== undefined ? payload.body : template.body;
        template.footer = payload.footer;
        template.buttons = payload.buttons.length > 0 ? payload.buttons : template.buttons;
        template.variableCount = extractVariableNumbers(template.body).length > 0
            ? Math.max(...extractVariableNumbers(template.body))
            : 0;
        template.updatedDate = new Date();

        await template.save();
        res.send({ status: 'success', message: 'Auto-saved', data: template });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        const template = await WhatsappTemplate.findById(req.params.id);
        if (!template) {
            return res.send({ status: 'error', message: 'Template not found' });
        }
        template.isActive = false;
        template.updatedDate = new Date();
        await template.save();
        res.send({ status: 'success', message: 'Template deleted' });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};

exports.duplicateTemplate = async (req, res) => {
    try {
        const source = await WhatsappTemplate.findById(req.params.id);
        if (!source) {
            return res.send({ status: 'error', message: 'Template not found' });
        }

        let baseName = `${source.templateName} (Copy)`;
        let candidateName = baseName;
        let counter = 1;
        while (await WhatsappTemplate.findOne({ templateName: new RegExp(`^${candidateName}$`, 'i'), isActive: true })) {
            counter += 1;
            candidateName = `${baseName} ${counter}`;
        }

        const clone = new WhatsappTemplate({
            templateName: candidateName,
            category: source.category,
            language: source.language,
            templateType: source.templateType,
            headerType: source.headerType,
            headerText: source.headerText,
            headerMediaUrl: source.headerMediaUrl,
            headerMediaType: source.headerMediaType,
            body: source.body,
            footer: source.footer,
            buttons: source.buttons,
            variableCount: source.variableCount,
            status: 'draft',
            createdBy: source.createdBy,
            versionHistory: []
        });
        clone.versionHistory = [buildSnapshot(clone, 'draft_save')];

        await clone.save();
        res.send({ status: 'success', message: 'Template duplicated', data: clone });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};

exports.submitToMeta = async (req, res) => {
    try {
        const template = await WhatsappTemplate.findById(req.params.id);
        if (!template) {
            return res.send({ status: 'error', message: 'Template not found' });
        }

        const validation = validateTemplatePayload(template);
        if (!validation.valid) {
            return res.send({ status: 'error', message: validation.errors.join(', '), errors: validation.errors });
        }

        if (!process.env.WHATSAPP_BUSINESS_ACCOUNT_ID) {
            return res.send({ status: 'error', message: 'WHATSAPP_BUSINESS_ACCOUNT_ID is not configured on the server' });
        }
        if (!process.env.WHATSAPP_ACCESS_TOKEN) {
            return res.send({ status: 'error', message: 'WHATSAPP_ACCESS_TOKEN is not configured on the server' });
        }

        const metaUrl = `https://graph.facebook.com/${process.env.GRAPH_API_VERSION || 'v20.0'}/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`;
        const metaPayload = {
            name: template.templateName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            category: template.category,
            language: template.language,
            components: buildMetaComponents(template)
        };

        const metaResponse = await axios.post(metaUrl, metaPayload, {
            headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` }
        });

        template.status = 'pending';
        template.metaTemplateId = metaResponse.data && metaResponse.data.id ? metaResponse.data.id : undefined;
        template.updatedDate = new Date();
        template.versionHistory.push(buildSnapshot(template, 'submit_to_meta'));
        await template.save();

        res.send({ status: 'success', message: 'Template submitted to Meta', data: template });
    } catch (err) {
        const metaMessage = err.response && err.response.data && err.response.data.error
            ? err.response.data.error.message
            : err.message;
        res.send({ status: 'error', message: metaMessage });
    }
};

exports.restoreVersion = async (req, res) => {
    try {
        const template = await WhatsappTemplate.findById(req.params.id);
        if (!template) {
            return res.send({ status: 'error', message: 'Template not found' });
        }
        const { versionIndex } = req.body;
        const snapshot = template.versionHistory[versionIndex];
        if (!snapshot) {
            return res.send({ status: 'error', message: 'Version not found' });
        }

        template.templateName = snapshot.templateName;
        template.category = snapshot.category;
        template.language = snapshot.language;
        template.templateType = snapshot.templateType;
        template.headerType = snapshot.headerType;
        template.headerText = snapshot.headerText;
        template.headerMediaUrl = snapshot.headerMediaUrl;
        template.body = snapshot.body;
        template.footer = snapshot.footer;
        template.buttons = snapshot.buttons;
        template.status = 'draft';
        template.updatedDate = new Date();

        await template.save();
        res.send({ status: 'success', message: 'Version restored', data: template });
    } catch (err) {
        res.send({ status: 'error', message: err.message });
    }
};
