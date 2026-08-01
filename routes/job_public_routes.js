const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const jobModel = require('../model/jobModel');

// jobDescription is stored as a Quill Delta (rich text) — an array of
// {insert, attributes} ops, not plain text. Extract just the inserted text.
function extractPlainText(delta) {
  if (!delta) return '';
  if (typeof delta === 'string') return delta;
  if (Array.isArray(delta)) {
    return delta.map((op) => (op && typeof op.insert === 'string') ? op.insert : '').join('').trim();
  }
  return '';
}

router.get('/job/:jobId', async (req, res) => {
  try {
    const job = await jobModel.findOne({ jobId: Number(req.params.jobId) });
    const url = `${process.env.web_url}/job/${req.params.jobId}`;

    if (!job) {
      return res.status(404).send(`<!DOCTYPE html><html><head><title>Not found</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:60px 20px;">
          <h2>Job not found</h2>
          <p>This job posting may have been removed.</p>
        </body></html>`);
    }

    const location = `${job.city || ''}, ${job.district || ''}, ${job.state || ''}`;
    const description = extractPlainText(job.jobDescription);
    const templatePath = path.join(__dirname, '..', 'controller', 'template', 'job_fallback.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const html = handlebars.compile(source)({
      title: job.jobTitle,
      orgName: job.orgName,
      message: `${location} | Salary: ${job.salary || 'N/A'}${description ? ' — ' + description : ''}`,
      image: job.jobImage,
      url,
      webUrl: process.env.web_url,
    });

    res.send(html);
  } catch (err) {
    res.status(500).send('Something went wrong loading this job.');
  }
});

module.exports = router;
