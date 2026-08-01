const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const jobModel = require('../model/jobModel');

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

    const templatePath = path.join(__dirname, '..', 'controller', 'template', 'job_fallback.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const html = handlebars.compile(source)({
      title: job.jobTitle,
      orgName: job.orgName,
      message: `${job.city || ''}, ${job.district || ''}, ${job.state || ''} | Salary: ${job.salary || 'N/A'}`,
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
