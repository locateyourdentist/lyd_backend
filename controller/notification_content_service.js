const axios = require('axios');
const NotificationContent = require('../model/notification_content_model');

const getNotificationContent = async (key, defaults = {}) => {
  let doc = null;
  try {
    doc = await NotificationContent.findOne({ key, isActive: true });
  } catch (err) {
    console.log(`[NotificationContent] Lookup failed for key "${key}":`, err.message);
  }

  return {
    emailSubject: doc?.emailSubject || defaults.emailSubject,
    title: doc?.title || defaults.title,
    message: doc?.message || defaults.message,
    whatsappTemplateName: doc?.whatsappTemplateName || defaults.whatsappTemplateName || '',
    whatsappLanguageCode: doc?.whatsappLanguageCode || defaults.whatsappLanguageCode || 'en_US',
    whatsappVariables: (doc?.whatsappVariables && doc.whatsappVariables.length)
      ? doc.whatsappVariables
      : (defaults.whatsappVariables || []),
  };
};

// Sends a Meta-approved WhatsApp template message directly via the Graph API,
// using whatever template name/language is configured on the notification_content
// record. Does NOT require the template to also be registered in our own
// whatsappTemplate collection — this supports templates created and approved
// directly on business.facebook.com.
const dispatchWhatsapp = async (content, toNumber, context = {}) => {
  if (!toNumber || !content?.whatsappTemplateName) {
    return;
  }
  if (!process.env.PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
    console.log('[WhatsApp] send skipped: PHONE_NUMBER_ID/WHATSAPP_ACCESS_TOKEN not configured');
    return;
  }

  try {
    const variableValues = (content.whatsappVariables || []).map((field) => context[field] ?? '');
    const url = `https://graph.facebook.com/${process.env.GRAPH_API_VERSION || 'v20.0'}/${process.env.PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      to: toNumber,
      type: 'template',
      template: {
        name: content.whatsappTemplateName,
        language: { code: content.whatsappLanguageCode || 'en_US' },
        components: variableValues.length
          ? [{ type: 'body', parameters: variableValues.map((value) => ({ type: 'text', text: String(value) })) }]
          : [],
      },
    };

    await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
    });
  } catch (err) {
    const metaMessage = err.response?.data?.error?.message || err.message;
    console.log('[WhatsApp] send error:', metaMessage);
  }
};

module.exports = { getNotificationContent, dispatchWhatsapp };
