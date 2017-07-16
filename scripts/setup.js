function initializePlayer() {
    addSettingsToPlayer();
    toggleMenu();
    initShaka();
    $($rangeInputs).on('input', progressBar).trigger('input');
    $($playDiv).on('click', togglePlay);
    $($volumeDiv).on('click', toggleVolume);
    $($seekBar).on('mousedown', () => {
        $video[0].pause();
        $($seekBar).on('change', seek);
    });
    $($volumeBar).on('mousedown', () => {
        $($volumeBar).on('change', changeValueOfVolume);
    });
    $($seekBar).on('mouseup', () => {
        $video[0].play();
    });
    $($video).on('timeupdate', seekTimeUpdate);
    $($video).on('loadedmetadata', getDuration);
    $($fullscreenDiv).on('click', toggleFullScreen);
    $($video).on('progress', changeProgressBar);
}

$(document).ready(initializePlayer);
