import logo from "./logo.svg";
import "./App.css";
import * as Tone from "tone";
import { buildQueries } from "@testing-library/react";

//All twelve semitones
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
//Four arbitrarily chosen octaves
const octaves = [1, 2, 3, 4];
//A collection of a few note lengths, ordered from longest to shortest
const lengths = ["1m", "4n.", "4n", "8n.", "8n", "4t", "16n", "8t"];
//The "distance" between the notes in a regular major scale. If the root note is C, the next note is two semitones above (D) and so on.
const majorKey = [0, 2, 4, 5, 7, 9, 11];
//The synth that plays the generated notes. Could be swapped for a sampled instrument instead
const synth = new Tone.Synth().toDestination();

//This is only used for demo purposes. At line 63, in "class Note":s constructor, it's used to schedule each new note at the beginning of a new bar.
//This should be changed to something more "musical".
let bar = 0;

//A class for the "song". My thought was that this could include all parameters that the user can change, which
//in turn would alter the generation of new notes inside the Song:s buffer
class Song {
  constructor(key, tempo, diatonicProbability) {
    this.key = key;
    this.tempo = Tone.Transport.bpm.rampTo(tempo, 0.1);
    //diatonic means that all notes and chords are within the constraints of the key.
    //This is not yet implemented, but could be used as a probability for generated notes to be within the key of the song.
    this.diatonicProbability = diatonicProbability;
    //a buffer of notes which has not been played yet
    this.buffer = new Buffer(this);
  }
}

class Buffer {
  constructor(song) {
    this.song = song;
    //the que is an array of "future" notes
    this.que = [];
    //lenght refers to how many beats of "music" have been generated in advance
    this.length = 0;
    this.fillBuffer();
  }

  //If less than 16 beats (4 measures) of music has been generated, more notes should be added to the que
  fillBuffer() {
    while (this.length < 16) {
      const note = new Note(this, this.song);
      this.que.push(note);
      //notationToFloat converts the Tone.js implementation of note length notation to a float value
      this.length += note.notationToFloat();
    }
  }

  //"schedule()" schedules all notes within the buffer that has not yet been scheduled
  //Something might need to be fixed here (even though it seems to work). When I demo the script in the browser, I get the following message:
  //"Events scheduled inside of scheduled callbacks should use the passed in scheduling time. See https://github.com/Tonejs/Tone.js/wiki/Accurate-Timing"
  schedule() {
    this.que.forEach((note) => {
      if (!note.isScheduled) {
        note.isScheduled = true;
        Tone.Transport.scheduleOnce(() => {
          synth.triggerAttackRelease(note.pitch + note.octave, note.length);
          //this part of the script fires when the note is played, so therefore we could remove the note from the buffer at this point
        }, note.startingPosition);
      }
    });
  }
}

//I decided to make a class for all notes that include extra information regarding position in time and whether or not it is scheduled yet.
//We could also add logic for the generation of new notes here. The note class has access to the buffer and song that it's generated within.
//If you have other ideas regarding data types and other stuff I'm definately open for that.
class Note {
  constructor(buffer, song) {
    //chooses pitch, octave and note length randomly from the given options in the top of the file.
    this.pitch = song.key[Math.floor(Math.random() * song.key.length)];
    this.octave = octaves[Math.floor(Math.random() * octaves.length)];
    this.length = lengths[Math.floor(Math.random() * lengths.length)];
    //this makes each note start at the head of a new bar.
    this.startingPosition = bar++ + ":0:0";
    this.isScheduled = false;
  }

  //notationToFloat converts the Tone.js implementation of note length to a float value. Probably could be done in a better way
  notationToFloat() {
    const split = this.length.split("");
    const lastChar = split[split.length - 1];
    const value = parseInt(this.length);
    let float = 1 / value;
    if (lastChar == ".") {
      float = float * 1.5;
    } else if (lastChar == "t") {
      float = float / 3;
    }
    return float;
  }
}

//This fires when the button is pressed. "Tone.start()" apparently should be done with async await. Creates a new song with a random key, generates and schedules
//16 beats (4 measures) of "music"
const test = async () => {
  await Tone.start();
  const song = new Song(keyPicker(), 100, 1);
  song.buffer.schedule();
  Tone.getTransport().start();
};

//randomly picks a root note and returns the major scale for that given root note. This should be tied to a menu where the user can choose the key instead.
function keyPicker() {
  const key = [];
  const root = notes[Math.floor(Math.random() * notes.length)];

  for (let i = 0; i < majorKey.length; i++) {
    let nextIndex = notes.indexOf(root) + majorKey[i];
    if (nextIndex >= notes.length) {
      nextIndex = nextIndex - notes.length;
    }
    key.push(notes[nextIndex]);
  }

  return key;
}

//creates a button
function TestButton() {
  return (
    <button variant="outlined" onClick={test}>
      Outlined
    </button>
  );
}

export default TestButton;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
