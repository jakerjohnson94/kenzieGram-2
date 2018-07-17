const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const publicPath = './public/';
const port = 3000;
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

function fileFilter(req, file, cb) {
  let type = file.mimetype;
  let typeArray = type.split('/');
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
    let originalname = file.originalname;
    let extension = originalname.split('.');
    filename = Date.now() + '.' + extension[extension.length - 1];
    cb(null, filename);
  },
});
const upload = multer({ storage: storage, dest: publicPath, fileFilter: fileFilter });

app.use(express.static(publicPath));
app.use(express.json());

app.get('/', function(req, res) {
  fs.readdir('./public/uploads', function(err, items) {
    if (err) throw new Error(err);
    if (items[0] === '.DS_Store') items.shift();

    res.render('index.pug', { items: items });
  });
});

app.post('/latest', function(req, res) {
  fs.readdir('./public/uploads', function(err, items) {
    if (err) throw new Error(err);
    res.status(201);
    let newPhotos = [];

    items.forEach(item => newPhotos.push([item, fs.statSync(`./public/uploads/${item}`).mtimeMs]));
    let newTimestamp = newPhotos.sort((a, b) => a[1] < b[1])[0][1];

    newPhotos = newPhotos.filter(a => a[1] > req.body.after);

    res.send({
      timestamp: newTimestamp,
      photos: newPhotos,
    });
  });
});

app.post('/public/uploads', upload.single('myFile'), function(req, res, next) {
  if (!req.file) {
    res.end(console.log('error, no file to upload'));
  } else {
    const timestamp = Date.now();
    req.file.timestamp = timestamp;
    console.log(req.file);

    // uploadedFiles.push(req.file);

    console.log('Uploaded: ' + req.file.filename);
    path.extname(req.file.originalname);

    res.render('success.pug', {
      port: port,
      file: req.file.filename,
    });
  }
});

app.listen(port, () => console.log(`Server Listening on Port ${port}`));
