var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
function onSaveButtonClicked(event) {
  console.log('clicked')
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function (cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg')
    })
  }
}

function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

function updateUi(data) {
  clearCards();
  for (let i = 0; i < data.length; i++){
    createCard(data[i])
  }
}
function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url('+data.image+')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardTitleTextElement.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  console.log('card wrapper',cardWrapper)
  sharedMomentsArea.appendChild(cardWrapper);
}

var url='https://pwa-101-bdd28.firebaseio.com/posts.json'
var networkDataReceived=false
fetch(url)
  .then(function (res) {
    console.log('response',res)
    return res.json();
  })
  .then(function (data) {
    console.log('from web',data);
    networkDataReceived = true
    var dataArray = []
    for (var key in data) {
      dataArray.push(data[key])
    }
    
    updateUi(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(data => {
      console.log('inside index')
      if (!networkDataReceived) {
        console.log('from cache',data)
        updateUi(data)
      }
  })
  }
// if ('caches' in window) [
//   caches.match(url)
//     .then(res => {
//       if (res) {
//         return res.json()
//       }
//     })
//     .then((data) => {
//       console.log('from cache',data)
//       if (!networkDataReceived) {
//         var dataArray=[]
//         for (var key in data) {
//           dataArray.push(data[key])
//         }
//         updateUi(dataArray)
//       }
      
//       })
// ]
