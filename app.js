const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const publicPath = './public/';
const port = 3000;
const app = express();

const uploadedFiles = [];

app.set('views', './views');
app.set('view engine', 'pug');

function fileFilter(req, file, cb) {
  var type = file.mimetype;
  var typeArray = type.split('/');
  if (typeArray[0] == 'image') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    var originalname = file.originalname;
    var extension = originalname.split('.');
    filename = +Date.now() + '.' + extension[extension.length - 1];
    cb(null, filename);
  },
});
const upload = multer({ storage: storage, dest: publicPath, fileFilter: fileFilter });

app.use(express.static(publicPath));
app.get('/', function(req, res) {
  fs.readdir('./public/uploads', function(err, items) {
    if (err) console.log(err);
    items = items.slice(1, items.length).sort((a, b) => a < b);

    res.render('index.pug', { items: items });
  });
});

app.post('/public/uploads', upload.single('myFile'), function(req, res, next) {
  if (!req.file) {
    res.end(console.log('error, no file to upload'));
  } else {
    console.log('Uploaded: ' + req.file.filename);
    path.extname(req.file.originalname);
    uploadedFiles.push(req.file.filename);
    res.render('success.pug', { port: port });
  }
});

app.listen(port, () => console.log(`Server Listening on Port ${port}`));
