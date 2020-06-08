var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    console.log('promt')
    deferredPrompt.userChoice.then(choiceResult => {
      console.log(choiceResult.outcome)
      if (choiceResult.outcome == 'dismissed') {
        console.log('user cancelled the installation');
      }
      else {
        console.log('user added to home screen');
      }
    })
    deferredPrompt = null;
  }
  console.log('promt null')

}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
