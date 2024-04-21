const express = require('express');

const app = express();

app.post('/', (req, res) => {
  res.json('test ok');
});

app.listen(4000, () => {
  console.log('app listening on port 4000');
});
