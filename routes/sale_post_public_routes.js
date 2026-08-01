const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const SalePost = require('../model/create_sale_model');

router.get('/sale/:id', async (req, res) => {
  try {
    const post = await SalePost.findOne({ _id: req.params.id, isActive: true });
    const url = `${process.env.web_url}/sale/${req.params.id}`;

    if (!post) {
      return res.status(404).send(`<!DOCTYPE html><html><head><title>Not found</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:60px 20px;">
          <h2>Sale post not found</h2>
          <p>This listing may have been removed.</p>
        </body></html>`);
    }

    const templatePath = path.join(__dirname, '..', 'controller', 'template', 'sale_post_fallback.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const html = handlebars.compile(source)({
      title: `${post.userType || 'Item'} for sale`,
      message: post.message,
      price: post.price,
      image: post.images && post.images[0],
      url,
      webUrl: process.env.web_url,
    });

    res.send(html);
  } catch (err) {
    res.status(500).send('Something went wrong loading this listing.');
  }
});

module.exports = router;
