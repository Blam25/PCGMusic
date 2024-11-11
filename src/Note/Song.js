import Buffer from "./Buffer";

//A class for the "song". My thought was that this could include all parameters that the user can change, which
//in turn would alter the generation of new notes inside the Song:s buffer
class Song {
  constructor(key, tempo, diatonicProbability, synth) {
    this.key = key;
    //this.tempo = Tone.Transport.bpm.rampTo(tempo, 0.1);
    //diatonic means that all notes and chords are within the constraints of the key.
    //This is not yet implemented, but could be used as a probability for generated notes to be within the key of the song.
    this.diatonicProbability = diatonicProbability;
    //a buffer of notes which has not been played yet
    this.buffer = new Buffer(this, synth);
    //this.synth = synth;
  }
}

export default Song;
