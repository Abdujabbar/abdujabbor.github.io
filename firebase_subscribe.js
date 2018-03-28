firebase.initializeApp({
    messagingSenderId: '47806732700'
});
var messaging = firebase.messaging();

$(window).load(function() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            subscribe();
        }
        $('#subscribe').on('click', function () {
            subscribe();
        });
    }
})


function subscribe() {
    messaging.requestPermission()
        .then(function () {
            messaging.getToken()
                .then(function (currentToken) {
                    console.log(currentToken);

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.warn('Can\'t receive token from firebase.');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function (err) {
                    console.warn('Error while receive token.', err);
                    setTokenSentToServer(false);
                });
    })
    .catch(function (err) {
        console.warn('Не удалось получить разрешение на показ уведомлений.', err);
    });
}

// sending ID own to server
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Sending token to own server...');

        var url = '';
        $.post(url, {
            token: currentToken
        });

        setTokenSentToServer(currentToken);
    } else {
        console.log('Token already sent to server.');
    }
}

//storing in local storage
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}