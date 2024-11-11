import logo from "./logo.svg";
import "./App.css";
import * as Tone from "tone";
import React, { useState, useEffect } from "react";
import Song from "./Note/Song";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { changeSpeed } from "./Note/Note";

// All twelve semitones
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// Four arbitrarily chosen octaves
const octaves = [1, 2, 3, 4];
// A collection of a few note lengths, ordered from longest to shortest
const lengths = ["1m", "4n.", "4n", "8n.", "8n", "4t", "16n", "8t"];
// The "distance" between the notes in a regular major scale. If the root note
// is C, the next note is two semitones above (D) and so on.
const majorKey = [0, 2, 4, 5, 7, 9, 11];
// The synth that plays the generated notes. Could be swapped for a sampled
// instrument instead
const synth = new Tone.Synth().toDestination();

// randomly picks a root note and returns the major scale for that given root note.
// This should be tied to a menu where the user can choose the key instead.
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

export default App;

function App() {
  var speed = 0.5;

  // This fires when the button is pressed. "Tone.start()" apparently should be done
  // with async await. Creates a new song with a random key, generates and schedules
  // 16 beats (4 measures) of "music"
  const test = async () => {
    Tone.start();
    const song = new Song(keyPicker(), 100, 1, synth);
    song.buffer.schedule();
    Tone.getTransport().start();
  };

  //creates a button
  function TestButton() {
    return (
      <button variant="outlined" onClick={test}>
        Outlined
      </button>
    );
  }

  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    console.log(value, "- Has changed");
    setValue(newValue);
    speed = newValue / 20;
    changeSpeed(speed);
    console.log(speed, "- Has changed");
  }

  return (
    <div className="App">
      <TestButton />
      <Slider
        aria-label="Volume"
        value={value}
        onChange={handleChange}
        min={1}
        max={10}
        steps={10}
        defaultValue={5}
      />
    </div>
  );
}
