let $video = $('#player-html5');
let $controlBar = $('#control-bar');
let $rangeInputs = $('input[type=range]');
let $playDiv = $('#play-div');
let $play = $('#play');
let $player = $('#player-wrapper');
let $volumeDiv = $('#volume-div');
let $volumeBar = $('#volume-bar');
let $volume = $('#volume');
let $seekBar = $('#seek-bar');
let $duration = $('#time');
let $fullscreenDiv = $('#full-screen-div');
let paused = true;

function progressBar(e) {
    let min = e.target.min;
    let max = e.target.max;
    let val = e.target.value;
    $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
    });
}

function toggleMenu() {
    $($controlBar).on('mouseleave', () => {
        $($controlBar).addClass('hide-control-bar');
    });

    $($controlBar).on('mouseover', () => {
        $($controlBar).removeClass('hide-control-bar');
    })
}

function togglePlay() {
    if (isPaused()) {
        $video[0].play();
        $($play).attr('class', 'fa fa-pause button');
        return paused = true;
    } else {
        $video[0].pause();
        $($play).attr('class', 'fa fa-play button');
        return paused = false;
    }
}

function isPaused() {
    if ($video[0].paused) {
        return true;
    } else {
        return false;
    }
}

function toggleVolume() {
    let storageVolumeValue = localStorage.getItem('volume');
    let backgroundSizePercent = storageVolumeValue * 100;
    let muted = 0;
    let valueOfBar = 0;
    if (!isMuted()) {
        $($volume).attr('class', 'fa fa-volume-off button');
        changeVolume(muted, valueOfBar);
    } else {
        $($volume).attr('class', 'fa fa-volume-up button');
        changeVolume(backgroundSizePercent, storageVolumeValue);
    }
}

function changeVolume(valueOfBar, valueOfVolume) {
    $volumeBar[0].style.backgroundSize = valueOfBar + "%" + " 100%";
    $volumeBar[0].value = valueOfBar;
    $video[0].volume = valueOfVolume;
}

function changeValueOfVolume() {
    if (isMuted()) {
        $($volume).attr('class', 'fa fa-volume-off button');
    } else {
        $($volume).attr('class', 'fa fa-volume-up button');
    }
    $video[0].volume = this.value / 100;
    localStorage.setItem('volume', $video[0].volume);
}

function isMuted() {
    if ($video[0].volume === 0) {
        return true;
    } else {
        return false;
    }
}

function getDuration() {
    let $duration = Math.round($video[0].duration);
    setDuration($duration);
    displayDuration($duration);
}

function setDuration(duration) {
    player.configure({
        streaming: {
            bufferingGoal: duration
        }
    });
}

function displayDuration(duration) {
    let hours = Math.floor(duration / (60 * 60));
    let divisorForMinutes = duration % (60 * 60);
    let minutes = Math.floor(divisorForMinutes / 60);
    let divisorForSeconds = divisorForMinutes % 60;
    let seconds = Math.ceil(divisorForSeconds);

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    let time = null;
    if (hours === "00") {
        time = minutes + ':' + seconds;
    } else {
        time = hours + ':' + minutes + ':' + seconds;
    }
    $duration[0].textContent = time;
}

function seek() {
    showBuffor();
    let seekTo = Math.round($video[0].duration * ($seekBar[0].value / 100));
    if (!paused) {
        $video[0].currentTime = seekTo;
        $video[0].pause();
    } else {
        $video[0].currentTime = seekTo;
    }
}

function seekTimeUpdate() {
    let changeCurrentTime = $video[0].currentTime / $video[0].duration * 100;
    let currentTime = Math.round($video[0].currentTime);
    $seekBar[0].value = changeCurrentTime;
    displayDuration(currentTime);
    $($rangeInputs).on('input', progressBar).trigger('input');
    hideBuffor();
}

function toggleFullScreen() {
    if ((!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if ($video[0].requestFullscreen) {
            $video[0].requestFullscreen();
            $($controlBar).attr('class', 'fullscreen');
        } else if ($video[0].webkitRequestFullScreen) {
            $video[0].webkitRequestFullScreen();
            $($controlBar).attr('class', 'fullscreen');
        } else if ($video[0].mozRequestFullScreen) {
            $video[0].mozRequestFullScreen();
            $($controlBar).attr('class', 'fullscreen');
        } else if ($video[0].msRequestFullscreen) {
            $video[0].msRequestFullscreen();
            $($controlBar).attr('class', 'fullscreen');
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            $($controlBar).attr('class', 'control-bar');
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            $($controlBar).attr('class', 'control-bar');
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            $($controlBar).attr('class', 'control-bar');
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            $($controlBar).attr('class', 'control-bar');
        }
    }
}

function checkStorageVolume() {
    let storageVolumeValue = localStorage.getItem('volume');
    if (storageVolumeValue !== null) {
        let seekBarValue = storageVolumeValue * 100;
        changeVolume(seekBarValue, storageVolumeValue);
    } else {
        $volumeBar.value = playerSettings.volume;
    }
}

function changeProgressBar() {
    let $progressBar = $('#progress-bar');
    if ($video[0].buffered.length > 0) {
        let percent = ($video[0].buffered.end(0) / $video[0].duration) * 100;
        $($progressBar).css({width: percent + '%'});
    }
}

function addSettingsToPlayer() {
    $($video[0]).attr('width', playerSettings.width);
    $($player).width(playerSettings.width);
    $($video[0]).attr('height', playerSettings.height);
    $($video[0]).attr('autoplay', playerSettings.autoplay);
    $video[0].muted = playerSettings.muted;
    $($video[0]).attr('poster', playerSettings.poster);
    checkStorageVolume();
}
