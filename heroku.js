const express = require('express');

const app = express();

const path = require('path');

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
