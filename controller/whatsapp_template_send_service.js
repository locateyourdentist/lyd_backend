const axios = require('axios');
const WhatsappTemplate = require('../model/whatsapp_template_model');

// Mirrors the language options offered in the Flutter WhatsApp Template
// Management UI (kLanguageOptions) mapped to Meta's language codes.
const META_LANGUAGE_CODES = {
    English: 'en_US',
    Hindi: 'hi',
    Tamil: 'ta',
    Telugu: 'te',
    Kannada: 'kn',
    Malayalam: 'ml',
    Marathi: 'mr',
    Gujarati: 'gu',
    Bengali: 'bn',
    Punjabi: 'pa',
};

function slugifyTemplateName(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function buildSendComponents(template, variableValues) {
    const components = [];

    if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(template.headerType) && template.headerMediaUrl) {
        const mediaKey = template.headerType.toLowerCase();
        components.push({
            type: 'header',
            parameters: [{ type: mediaKey, [mediaKey]: { link: template.headerMediaUrl } }],
        });
    }

    if (variableValues.length > 0) {
        components.push({
            type: 'body',
            parameters: variableValues.map((value) => ({ type: 'text', text: String(value) })),
        });
    }

    return components;
}

/**
 * Sends a Meta-approved WhatsApp template message using the admin-customized
 * template (edited via the WhatsApp Template Management page in Flutter).
 * Not wired into any route yet — call it directly from any controller:
 *
 *   const { sendWhatsappTemplateMessage } = require('./whatsapp_template_send_service');
 *   await sendWhatsappTemplateMessage('+9198xxxxxxx', 'appointment_reminder', ['John', 'Dr. Smith']);
 */
exports.sendWhatsappTemplateMessage = async (toNumber, templateName, variableValues = []) => {
    const template = await WhatsappTemplate.findOne({
        templateName: new RegExp(`^${templateName.trim()}$`, 'i'),
        isActive: true,
    });

    if (!template) {
        return { success: false, message: `WhatsApp template "${templateName}" not found` };
    }
    if (template.status !== 'approved') {
        return {
            success: false,
            message: `Template "${templateName}" is not approved by Meta yet (status: ${template.status})`,
        };
    }
    if (!process.env.PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
        return { success: false, message: 'WhatsApp sending is not configured on the server' };
    }

    const languageCode = META_LANGUAGE_CODES[template.language] || template.language;
    const url = `https://graph.facebook.com/${process.env.GRAPH_API_VERSION || 'v20.0'}/${process.env.PHONE_NUMBER_ID}/messages`;

    const payload = {
        messaging_product: 'whatsapp',
        to: toNumber,
        type: 'template',
        template: {
            name: slugifyTemplateName(template.templateName),
            language: { code: languageCode },
            components: buildSendComponents(template, variableValues),
        },
    };

    try {
        const response = await axios.post(url, payload, {
            headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
        });
        return { success: true, message: 'WhatsApp template message sent', data: response.data };
    } catch (err) {
        const metaMessage = err.response && err.response.data && err.response.data.error
            ? err.response.data.error.message
            : err.message;
        return { success: false, message: metaMessage };
    }
};
