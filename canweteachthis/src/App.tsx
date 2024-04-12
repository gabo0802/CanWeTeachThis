import React from "react";
import logo from "./logo.svg";
import "./App.css";
import dotenv from "dotenv";

dotenv.config();

function App() {
  const apiKey = process.env.API_KEY;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>API Key: {apiKey}</p>
      </header>
    </div>
  );
}

export default App;
