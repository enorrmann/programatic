const scribble = require('scribbletune');
const midi = require('./midiWriter.js');


var toScribble = function(steps) {
    var pattern = "";
    for (i = 0; i < steps.length; i++) {
        var step = steps[i];
        //pattern += step.state == 1 ? "x" : "-";
        pattern += step.scribble;
    }
    return pattern;
}

var generate = function(message) {
    var pads = JSON.parse(message);
    var clips = [];

    pads.forEach(function(pad, index) {

        pad.tracks.forEach(function(track, index) {
            var pattern = toScribble(track.steps);

            var mode = track.mode;
            var subdiv = track.subdiv ? track.subdiv : '8n';

            if (mode == 'arp') {
                var notes = scribble.arp(track.chord);
            } else {
                var notes = track.note;
            }


            var clip = scribble.clip({
                notes: notes,
                subdiv: subdiv,
                pattern: pattern
            });
            var channelClip = {
                clip: clip,
                channel: pad.channel
            }
            clips.push(channelClip);

        });
    });



    midi.toMidi(clips);
}

module.exports = {
    generate: generate
}