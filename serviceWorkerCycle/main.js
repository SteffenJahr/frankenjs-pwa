function sendMessage() {
    navigator.serviceWorker.controller.postMessage('version');
}

function update() {
    // Get the service worker registration and listen on state changes or update directly
    navigator.serviceWorker.getRegistration()
        .then(function (reg) {
            if (reg.installing) {
                reg.installing.addEventListener('statechange', function (state) {
                    if (req.installing.state === 'installed') {
                        req.installing.postMessage('update');
                    }
                });
            }
            if (reg.waiting) {
                reg.waiting.postMessage('update');
            }
        })
}

function sync() {
    // Get the service worker registration and send a sync request
    navigator.serviceWorker.getRegistration()
        .then(function (reg) {
            reg.sync.register('data');
        });
}

if ('serviceWorker' in navigator) {
    // Register Service Worker
    navigator.serviceWorker.register('serviceWorker.js')
        .then(function (reg) {
            reg.addEventListener('updatefound', function (event) {
                document.getElementById('update').style.display = 'block';
            });
        });

    // Listen on messages from Service Worker
    navigator.serviceWorker.addEventListener('message', function (event) {
        console.log(event.data);
    });

    // Reload the window if a new service worker takes control of the application
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
    });
}
