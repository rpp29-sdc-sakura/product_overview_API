const app = require('./expressApp.js');
const port = 3000;

app.listen( port, function() {
  console.log(`listening on port ${port}`);
});

