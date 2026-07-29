const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const WhatsappTemplate = require('./model/whatsapp_template_model');
const NotificationContent = require('./model/notification_content_model');

const LANGUAGE = 'en_US';

const TEMPLATES = [
  {
    key: 'otp_registration',
    label: 'Registration OTP',
    emailSubject: 'LYD OTP Verification Mail',
    title: 'Welcome to LYD!',
    message: 'Thank you for registering with LYD. Please use the OTP below to verify your email address. This OTP is valid for 10 minutes.',
    body: 'Hi {{1}}, your OTP is {{2}}. It is valid for 10 minutes.',
    variables: ['name', 'otp'],
  },
  {
    key: 'otp_resend',
    label: 'Resend Registration OTP',
    emailSubject: 'LYD OTP Verification Mail',
    title: 'Password Reset',
    message: 'Use the OTP below to verify your email. This OTP is valid for 10 minutes.',
    body: 'Hi {{1}}, your OTP is {{2}}. It is valid for 10 minutes.',
    variables: ['name', 'otp'],
  },
  {
    key: 'otp_forgot_password',
    label: 'Forgot Password OTP',
    emailSubject: 'LYD OTP Verification Mail',
    title: 'Password Reset',
    message: 'Use the OTP below to reset your password. This OTP is valid for 10 minutes.',
    body: 'Hi {{1}}, your OTP is {{2}}. It is valid for 10 minutes.',
    variables: ['name', 'otp'],
  },
  {
    key: 'welcome_user',
    label: 'Welcome New User',
    emailSubject: 'Welcome to LYD',
    title: 'Welcome 🎉',
    message: "We're excited to have you on board! Below are your login credentials:",
    body: 'Hi {{1}}, welcome to LYD! Your account has been created.',
    variables: ['name'],
  },
  {
    key: 'plan_activated_user',
    label: 'Plan Activated',
    emailSubject: 'Your LYD Plan is Activated',
    title: 'Plan Activated Successfully',
    message: 'Your subscription has been successfully activated. Here are the details:',
    body: 'Hi {{1}}, your {{2}} plan is now active.',
    variables: ['name', 'planName'],
  },
  {
    key: 'job_post_new',
    label: 'New Job Posted',
    emailSubject: 'New Job Opportunity',
    title: 'New Job Opportunity 🎉',
    message: 'A new job has been posted.',
    body: 'Hi {{1}}, a new job for {{2}} has been posted.',
    variables: ['name', 'jobTitle'],
  },
  {
    key: 'job_status_applied',
    label: 'Job Status: Applied',
    emailSubject: 'Job Application Update',
    title: 'Application Status Update',
    message: 'A new job application has been submitted',
    body: 'Hi {{1}}, your application for {{2}} has been received and is under review.',
    variables: ['name', 'jobTitle'],
  },
  {
    key: 'job_status_shortlisted',
    label: 'Job Status: Shortlisted',
    emailSubject: 'Job Application Update',
    title: 'Application Status Update',
    message: 'Your application has been shortlisted',
    body: 'Hi {{1}}, your application for {{2}} has been shortlisted.',
    variables: ['name', 'jobTitle'],
  },
  {
    key: 'job_status_rejected',
    label: 'Job Status: Rejected',
    emailSubject: 'Job Application Update',
    title: 'Application Status Update',
    message: 'Your application has been rejected',
    body: 'Hi {{1}}, thank you for applying for {{2}}. We will not be proceeding with your application at this time.',
    variables: ['name', 'jobTitle'],
  },
  {
    key: 'job_status_selected',
    label: 'Job Status: Selected',
    emailSubject: 'Job Application Update',
    title: 'Application Status Update',
    message: 'Congratulations! You have been selected',
    body: 'Hi {{1}}, congratulations! You have been selected for {{2}}.',
    variables: ['name', 'jobTitle'],
  },
  {
    key: 'admin_notification_broadcast',
    label: 'Admin Broadcast Notification',
    emailSubject: '',
    title: '',
    message: '',
    body: 'Hi {{1}}, {{2}}: {{3}}',
    variables: ['name', 'title', 'message'],
  },
];

async function submitToMeta(templateDoc) {
  const metaUrl = `https://graph.facebook.com/${process.env.GRAPH_API_VERSION || 'v20.0'}/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`;
  const metaPayload = {
    name: templateDoc.templateName,
    category: templateDoc.category,
    language: templateDoc.language,
    components: [{ type: 'BODY', text: templateDoc.body }],
  };
  const response = await axios.post(metaUrl, metaPayload, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
  });
  return response.data;
}

async function run() {
  const uri = `${process.env.mongodb_url}${process.env.APP_NAME}`;
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected to MongoDB\n');

  const results = [];

  for (const t of TEMPLATES) {
    const result = { key: t.key, templateName: t.key };
    try {
      let templateDoc = await WhatsappTemplate.findOne({ templateName: t.key });
      if (!templateDoc) {
        templateDoc = new WhatsappTemplate({
          templateName: t.key,
          category: 'UTILITY',
          language: LANGUAGE,
          templateType: 'TEXT',
          headerType: 'NONE',
          body: t.body,
          variableCount: t.variables.length,
          status: 'draft',
          createdBy: 'automated-seed-script',
        });
        await templateDoc.save();
        result.templateCreated = true;
      } else {
        result.templateCreated = false;
        result.note = 'whatsappTemplate doc already existed, reusing';
      }

      if (templateDoc.status === 'draft') {
        const metaResponse = await submitToMeta(templateDoc);
        templateDoc.status = 'pending';
        templateDoc.metaTemplateId = metaResponse?.id;
        templateDoc.updatedDate = new Date();
        await templateDoc.save();
        result.submittedToMeta = true;
        result.metaTemplateId = metaResponse?.id;
      } else {
        result.submittedToMeta = false;
        result.note = `existing status is "${templateDoc.status}", not resubmitting`;
      }

      let contentDoc = await NotificationContent.findOne({ key: t.key });
      if (!contentDoc) {
        contentDoc = new NotificationContent({
          key: t.key,
          label: t.label,
          emailSubject: t.emailSubject,
          title: t.title,
          message: t.message,
          whatsappTemplateName: t.key,
          whatsappLanguageCode: LANGUAGE,
          whatsappVariables: t.variables,
        });
        await contentDoc.save();
        result.contentCreated = true;
      } else {
        contentDoc.whatsappTemplateName = t.key;
        contentDoc.whatsappLanguageCode = LANGUAGE;
        contentDoc.whatsappVariables = t.variables;
        contentDoc.updatedDate = new Date();
        await contentDoc.save();
        result.contentCreated = false;
        result.note = (result.note ? result.note + '; ' : '') + 'notification_content doc already existed, updated whatsapp fields';
      }

      result.status = 'OK';
    } catch (err) {
      result.status = 'FAILED';
      result.error = err.response?.data?.error?.message || err.message;
    }
    results.push(result);
  }

  console.log(JSON.stringify(results, null, 2));

  const failed = results.filter(r => r.status === 'FAILED');
  console.log(`\n${results.length - failed.length}/${results.length} succeeded, ${failed.length} failed`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
