const photoOutput = document.getElementById('photoOut');
let timestamp = Date.now();
let errCount = 0;
function pollImages() {
  let after = {
    after: timestamp,
  };
  fetch('/latest', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(after),
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('errorOut').textContent = '';
      if (data.photos.length) data.photos.forEach(photo => appendGalleryPhoto(photo[0]));
      timestamp = data.timestamp;
      setTimeout(pollImages, 5000);
    })
    .catch(error => {
      errCount++;
      console.log(errCount + error);
      if (errCount === 1) {
        document.getElementById('errorOut').textContent =
          'Connection Failed, Attempting to Reconnect...';
        return setTimeout(pollImages, 3000);
      }
      if (errCount === 2) {
        return (document.getElementById('errorOut').textContent =
          'Reconnect Failed, Closing Server.');
      }
    });
}

function appendGalleryPhoto(photo) {
  const classes = ['col', 's12', 'm6', 'l4', 'xl4', 'center'];
  const div = document.createElement('div');
  const imgDiv = document.createElement('img');
  imgDiv.classList.add('grid-item');
  imgDiv.src = `./uploads/${photo}`;
  for (let c of classes) {
    div.classList.add(c);
  }
  photoOutput.prepend(div);
  div.prepend(imgDiv);
}

pollImages();
