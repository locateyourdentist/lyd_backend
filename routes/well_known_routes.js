const express = require('express');
const router = express.Router();

// Android App Links verification.
// TODO: replace with the real release-signing certificate's SHA256 fingerprint.
router.get('/assetlinks.json', (req, res) => {
  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.catchytechnologies.LYD.locate_your_dentist',
        sha256_cert_fingerprints: ['REPLACE_WITH_RELEASE_SHA256_FINGERPRINT'],
      },
    },
  ]);
});

// iOS Universal Links verification.
// TODO: replace REPLACE_WITH_TEAM_ID with the real Apple Developer Team ID.
router.get('/apple-app-site-association', (req, res) => {
  res.type('application/json').json({
    applinks: {
      apps: [],
      details: [
        {
          appID: 'REPLACE_WITH_TEAM_ID.com.catchytechnologies.LYD.locateYourDentist',
          paths: ['/sale/*', '/job/*'],
        },
      ],
    },
  });
});

module.exports = router;
