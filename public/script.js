let photoOutput = document.getElementById('photoOut');
let timestamp = Date.now();
async function pollImages() {
  var after = {
    after: timestamp,
  };
  fetch('/latest', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(after),
  })
    .then(async function(response) {
      if (response.ok) {
        return response.json();
      } else throw await response.json();
    })
    .then(
      await function(data) {
        for (let i = 1; i < data.length; i++) {
          let img = data[i];
        }
        if (data.photos.length) {
          for (let p of data.photos) {
            appendGalleryPhoto(p[0]);
          }
        }
        timestamp = data.timestamp;
        // poll again after waiting 5 seconds
        setTimeout(pollImages, 5000);
      }
    );
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
