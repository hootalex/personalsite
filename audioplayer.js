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
        // barWidth: 1,
    });


    // Load audio from URL
    wavesurfer.load('http://f.cl.ly/items/3d3o1R2g3s0G1X11291T/Different%20Sundays.mp3');


    // Play button
    var button = document.querySelector('[data-action="play"]');

    button.addEventListener('click', wavesurfer.playPause.bind(wavesurfer));
});
