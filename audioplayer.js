'use strict';

// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
    // Init
    wavesurfer.init({
        container: document.querySelector('#waveform'),
        waveColor: 'white',
        progressColor: '#111111',
        backend: 'MediaElement',
        hideScrollbar: 'true',
        cursorWidth: 0,
        height: 50,
        normalize: true,
        barWidth: 1,
    });


    // Load audio from URL
    wavesurfer.load('http://f.cl.ly/items/2r3x1q082B2Q1N0g0A1i/Pretty%20Beat.mp3');


    // Play button
    var button = document.querySelector('[data-action="play"]');

    button.addEventListener('click', wavesurfer.playPause.bind(wavesurfer));
});
