'use strict';

// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
    // Init
    wavesurfer.init({
        container: document.querySelector('#waveform'),
        waveColor: '#7FDBFF',
        progressColor: 'white',
        backend: 'MediaElement',
        hideScrollbar: 'true',
        cursorWidth: 0,
        height: 50,
        normalize: true,
        barWidth: 1,
    });


    // Load audio from URL
    wavesurfer.load('audio/codawaltzdegraded.mp3');


    // Play button
    var button = document.querySelector('[data-action="play"]');

    button.addEventListener('click', wavesurfer.playPause.bind(wavesurfer));
});
