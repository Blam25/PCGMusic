import Note from "./Note";
import * as Tone from "tone";

class Buffer {
  constructor(song, synth) {
    this.song = song;
    //the que is an array of "future" notes
    this.que = [];
    //lenght refers to how many beats of "music" have been generated in advance
    this.length = 0;
    this.fillBuffer();
    this.synth = synth;
  }

  // If less than 16 beats (4 measures) of music has been generated,
  // more notes should be added to the que
  fillBuffer() {
    while (this.length < 16) {
      const note = new Note(this, this.song);
      this.que.push(note);
      //notationToFloat converts the Tone.js implementation of note length
      // notation to a float value
      this.length += note.notationToFloat();
    }
  }

  //"schedule()" schedules all notes within the buffer that has not yet been scheduled
  //Something might need to be fixed here (even though it seems to work). When I demo
  //the script in the browser, I get the following message:
  //"Events scheduled inside of scheduled callbacks should use the passed in
  // scheduling time. See https://github.com/Tonejs/Tone.js/wiki/Accurate-Timing"
  schedule() {
    this.que.forEach((note) => {
      if (!note.isScheduled) {
        note.isScheduled = true;
        Tone.Transport.scheduleOnce(() => {
          this.synth.triggerAttackRelease(
            note.pitch + note.octave,
            note.length,
          );
          // this part of the script fires when the note is played, so therefore
          // we could remove the note from the buffer at this point
        }, note.startingPosition);
      }
    });
  }
}

export default Buffer;
