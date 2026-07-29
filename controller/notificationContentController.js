const NotificationContent = require('../model/notification_content_model');

exports.getContents = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { isActive: true };
    if (search && search.trim()) {
      query.$or = [
        { key: new RegExp(search.trim(), 'i') },
        { label: new RegExp(search.trim(), 'i') }
      ];
    }
    const contents = await NotificationContent.find(query).sort({ updatedDate: -1 });
    res.send({ status: 'success', message: 'Notification contents fetched', data: contents });
  } catch (err) {
    res.send({ status: 'error', message: err.message });
  }
};

exports.getContentById = async (req, res) => {
  try {
    const content = await NotificationContent.findById(req.params.id);
    if (!content) {
      return res.send({ status: 'error', message: 'Notification content not found' });
    }
    res.send({ status: 'success', message: 'Notification content fetched', data: content });
  } catch (err) {
    res.send({ status: 'error', message: err.message });
  }
};

exports.createContent = async (req, res) => {
  try {
    const { key, label, emailSubject, title, message, whatsappTemplateName, whatsappLanguageCode, whatsappVariables } = req.body;

    if (!key || !key.trim()) {
      return res.send({ status: 'error', message: 'key is required' });
    }

    const existing = await NotificationContent.findOne({ key: key.trim(), isActive: true });
    if (existing) {
      return res.send({ status: 'error', message: 'A notification content with this key already exists' });
    }

    const newContent = new NotificationContent({
      key: key.trim(),
      label,
      emailSubject,
      title,
      message,
      whatsappTemplateName,
      whatsappLanguageCode,
      whatsappVariables: Array.isArray(whatsappVariables) ? whatsappVariables : []
    });

    await newContent.save();
    res.send({ status: 'success', message: 'Notification content created', data: newContent });
  } catch (err) {
    res.send({ status: 'error', message: err.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const content = await NotificationContent.findById(req.params.id);
    if (!content) {
      return res.send({ status: 'error', message: 'Notification content not found' });
    }

    const { label, emailSubject, title, message, whatsappTemplateName, whatsappLanguageCode, whatsappVariables } = req.body;

    if (label !== undefined) content.label = label;
    if (emailSubject !== undefined) content.emailSubject = emailSubject;
    if (title !== undefined) content.title = title;
    if (message !== undefined) content.message = message;
    if (whatsappTemplateName !== undefined) content.whatsappTemplateName = whatsappTemplateName;
    if (whatsappLanguageCode !== undefined) content.whatsappLanguageCode = whatsappLanguageCode;
    if (whatsappVariables !== undefined) content.whatsappVariables = Array.isArray(whatsappVariables) ? whatsappVariables : [];
    content.updatedDate = new Date();

    await content.save();
    res.send({ status: 'success', message: 'Notification content saved', data: content });
  } catch (err) {
    res.send({ status: 'error', message: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const content = await NotificationContent.findById(req.params.id);
    if (!content) {
      return res.send({ status: 'error', message: 'Notification content not found' });
    }
    content.isActive = false;
    content.updatedDate = new Date();
    await content.save();
    res.send({ status: 'success', message: 'Notification content deleted' });
  } catch (err) {
    res.send({ status: 'error', message: err.message });
  }
};
