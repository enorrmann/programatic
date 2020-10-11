var fs = require('fs');
var jsmidgen = require('jsmidgen');

const createFileFromNotes = (channelClip) => {
    const file = new jsmidgen.File();
    var tracks = [];
    var bpm = 120;

    // always 8 channels for compatibility with jack player reload
    for (i = 0; i < 80; i++) {
        tracks.push(new jsmidgen.Track());
        var track = tracks[i];
        track.setTempo(bpm);
        file.addTrack(track);
    }


    for (i = 0; i < channelClip.length; i++) {
        var channel = channelClip[i].channel;
        var notes = channelClip[i].clip;
        var track = tracks[i];

        for (const noteObj of notes) {
            const level = noteObj.level || 127;
            // While writing chords (multiple notes per tick)
            // only the first noteOn (or noteOff) needs the complete arity of the function call
            // subsequent calls need only the first 2 args (channel and note)
            if (noteObj.note) {
                if (typeof noteObj.note === 'string') {
                    track.noteOn(channel, noteObj.note, noteObj.length, level); // channel, pitch(note), length, velocity
                    track.noteOff(channel, noteObj.note, noteObj.length, level);
                } else {
                    track.addChord(channel, noteObj.note, noteObj.length, level);
                }
            } else {
                track.noteOff(channel, '', noteObj.length);
            }
        }
    }

    return file;
};

var toMidi = function(clips) {
    const file = createFileFromNotes(clips);
    const bytes = file.toBytes();
    fs.writeFileSync('test.mid', bytes, 'binary');

}
module.exports = {
    toMidi: toMidi
}