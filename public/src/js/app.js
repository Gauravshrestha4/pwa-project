var deferredPrompt;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.
        register('/sw.js').then(function () {
            console.log('service worker registered');
        })
}

window.addEventListener('beforeinstallprompt', (event) => {
    console.log('befire install evnet fired')
    event.preventDefault();
    deferredPrompt = event;
    return false;
})