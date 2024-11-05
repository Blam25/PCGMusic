import logo from "./logo.svg";
import "./App.css";
import * as Tone from "tone";

const test = () => {
  console.log("yo");
  synth.triggerAttackRelease("C4", "8n");
};

const synth = new Tone.Synth().toDestination();

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
