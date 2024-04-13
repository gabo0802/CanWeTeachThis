import React from "react";
import "./App.css";

function App() {
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;

  var url =
    "https://newsapi.org/v2/everything?" +
    "q='Evolution'+education&" +
    "from=2024-04&" +
    "sortBy=popularity&" +
    "apiKey=" +
    apiKey;

  var req = new Request(url);

  fetch(req).then(function (response) {
    console.log("Requesting data from News API...");
    console.log(response.json());
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">
          Can We Teach This? Creative Reflection
        </h1>
      </header>
    </div>
  );
}
export default App;
