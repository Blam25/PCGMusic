//Four arbitrarily chosen octaves
const octaves = [1, 2, 3, 4];
//A collection of a few note lengths, ordered from longest to shortest
const lengths = ["1m", "4n.", "4n", "8n.", "8n", "4t", "16n", "8t"];

var play_speed = 0.5;

function changeSpeed(newSpeed) {
  play_speed = newSpeed;
}

// I decided to make a class for all notes that include extra information regarding
// position in time and whether or not it is scheduled yet.
// We could also add logic for the generation of new notes here. The note class
// has access to the buffer and song that it's generated within.
// If you have other ideas regarding data types and other stuff I'm definately
// open for that.
class Note {
  constructor(buffer, song) {
    // chooses pitch, octave and note length randomly from the given options in
    // the top of the file.
    this.pitch = song.key[Math.floor(Math.random() * song.key.length)];
    this.octave = 3;
    //this.octave = octaves[Math.floor(Math.random() * octaves.length)];
    this.length = "8n";
    //this.length = lengths[Math.floor(Math.random() * lengths.length)];
    // this makes each note start at the head of a new bar.
    bar = bar + play_speed;
    this.startingPosition = bar + ":0:0";
    this.isScheduled = false;
  }

  // notationToFloat converts the Tone.js implementation of note length to a float
  // value. Probably could be done in a better way
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

// This is only used for demo purposes. At line 63, in "class Note":s
// constructor, it's used to schedule each new note at the beginning of a new bar.
// This should be changed to something more "musical".
let bar = 0;

export { Note, changeSpeed };
