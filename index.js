require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const urlList = ["http://www.giocode.net"];
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
//Midleware
function checkUrl(req, res, next){
  const {url} = req.body;
  dns.lookup(new URL(url).hostname, (err) => {
    if(err){
      res.json({
        error: 'invalid url'
      });
      return;
    }
    next();
  })
}
// Your first API endpoint
app.get('/api/shorturl/:code', function(req, res) {
  const {code} = req.params;
  if(code > urlList.length || code < 1){
    res.json({
      error: "No short URL found for the given input"
    })
    return;
  }
  res.redirect(urlList[code]);
});

app.post('/api/shorturl', checkUrl, function(req, res){
  const {url} = req.body; 
  urlList.push(url);
  res.json({
    original_url: url,
    short_url: urlList.length-1
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
