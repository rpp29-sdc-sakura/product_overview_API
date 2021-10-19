const app = require('./expressApp.js');
const { EXPRESS_PORT } = require('../config.js');

app.listen(EXPRESS_PORT, function() {
  console.log(`listening on port ${EXPRESS_PORT}`);
});

