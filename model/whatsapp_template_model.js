const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['QUICK_REPLY', 'CALL', 'WEBSITE', 'COPY_CODE', 'DYNAMIC_URL']
    },
    text: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    url: {
        type: String
    },
    exampleCode: {
        type: String
    }
}, { _id: false });

const versionSnapshotSchema = new mongoose.Schema({
    snapshotAt: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        enum: ['draft_save', 'submit_to_meta']
    },
    templateName: { type: String },
    category: { type: String },
    language: { type: String },
    templateType: { type: String },
    headerType: { type: String },
    headerText: { type: String },
    headerMediaUrl: { type: String },
    body: { type: String },
    footer: { type: String },
    buttons: [buttonSchema],
    status: { type: String }
}, { _id: false });

const whatsappTemplateSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['MARKETING', 'UTILITY', 'AUTHENTICATION'],
        required: true
    },
    language: {
        type: String,
        required: true
    },
    templateType: {
        type: String,
        enum: ['TEXT', 'MEDIA', 'CAROUSEL', 'INTERACTIVE'],
        default: 'TEXT'
    },
    headerType: {
        type: String,
        enum: ['NONE', 'TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'],
        default: 'NONE'
    },
    headerText: {
        type: String
    },
    headerMediaUrl: {
        type: String
    },
    headerMediaType: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    footer: {
        type: String
    },
    buttons: [buttonSchema],
    variableCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    },
    metaTemplateId: {
        type: String
    },
    metaRejectionReason: {
        type: String
    },
    createdBy: {
        type: String
    },
    versionHistory: [versionSnapshotSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('whatsappTemplate', whatsappTemplateSchema);
