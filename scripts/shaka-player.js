let manifestUri = playerSettings.mpdSrc;
let $loaderDiv = $('#loader');
let authTokenServer = '//cwip-shaka-proxy.appspot.com/get_auth_token';
let authToken = null;

function hideBuffor() {
    $loaderDiv[0].style.display = 'none';
}

function showBuffor() {
    $loaderDiv[0].style.display = 'block';
}

function initShaka() {
    showBuffor();
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
        initPlayer();
    } else {
        showBuffor();
        console.error('Browser not supported!');
    }
}

function addWidevineServer(player) {
    let licenseServer = '//cwip-shaka-proxy.appspot.com/header_auth';
    player.configure({
        drm: {
            servers: {'com.widevine.alpha': licenseServer}
        }
    });
}

function addTokenToHeader(request) {
    request.headers['CWIP-Auth-Header'] = authToken;
}

function initPlayer() {
    let $video = $('#player-html5');
    let player = new shaka.Player($video[0]);
    window.player = player;
    setDuration();
    $(player).on('error', onErrorEvent);
    addWidevineServer(player);
    player.getNetworkingEngine().registerRequestFilter(function (type, request) {
        if (type != shaka.net.NetworkingEngine.RequestType.LICENSE) return;
        let authRequest = {
            uris: [authTokenServer],
            method: 'POST',
        };
        let requestType = shaka.net.NetworkingEngine.RequestType.APP;
        if (authToken) {
            addTokenToHeader(request);
            return;
        }
        return player.getNetworkingEngine().request(requestType, authRequest).then(
            function (response) {
                authToken = shaka.util.StringUtils.fromUTF8(response.data);
                addTokenToHeader(request);
            });
    });
    player.load(manifestUri).then(function () {
        setTimeout(function () {
            hideBuffor();
        }, 1000);
    }).catch(onError);
}

function onErrorEvent(event) {
    let $errorText = $('#error-detail');
    switch (event.code) {
        case 1001:
            $errorText.text(error[1001]);
            break;
        case 1002:
            $errorText.text(error[1002]);
            break;
        case 1003:
            $errorText.text(error[1003]);
            break;
        case 6001:
            $errorText.text(error[6001]);
            break;
        case 6007:
            $errorText.text(error[6007]);
            break;
    }
    onError(event.detail);
    $('#error').css('display', 'block');
    $('#control-bar').css('display', 'none');
    player.destroy();
}

function onError(error) {
    console.error('Error code', error.code, 'object', error);
}
