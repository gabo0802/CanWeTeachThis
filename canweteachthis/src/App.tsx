import "./App.css";
import React, { useState, useEffect, SetStateAction } from "react";
import { EvolutionNewsData } from "./types";
import ControversyRadialChart from "./ControversyRadialChart";

async function fetchNewsData(searchTerm: any, startDate: any, endDate: any) {
  const response = await fetch("http://localhost:5000/fetch_news_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      search_term: searchTerm,
      startDate: startDate,
      endDate: endDate,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return data; // Assuming your API returns processed data in JSON format
  } else {
    throw new Error("Error fetching data from API");
  }
}

function App() {
  const [newsData, setNewsData] = useState([] as EvolutionNewsData[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testData: EvolutionNewsData[] = [
    { year: 1950, newsCount: 10 },
    { year: 1960, newsCount: 20 },
    { year: 1970, newsCount: 30 },
    { year: 1980, newsCount: 40 },
    { year: 1990, newsCount: 30 },
    { year: 2000, newsCount: 20 },
    { year: 2010, newsCount: 10 },
    { year: 2020, newsCount: 40 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset errors
      try {
        const data = await fetchNewsData("covid", "2024-04-17", "2024-04-17");
        console.log(data);
        const tmp: EvolutionNewsData[] = data.map(() => {
          return { year: data.year, newsCount: data.newsCount };
        });
        setNewsData(tmp); // Assign the value of tmp to newsData state variable
      } catch (error: unknown) {
        setError(error as SetStateAction<null>);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch data only once on component mount

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">
          Can We Teach This? Creative Reflection
        </h1>
        {/* Conditional Rendering */}
        {isLoading && <p>Loading data from News API...</p>}
        {error && <p>Error fetching data: {error}</p>}
        {newsData && (
          <ControversyRadialChart width={100} height={100} data={newsData} />
        )}

        {/* Fallback to test data if needed  */}
        {!newsData && !isLoading && !error && (
          <ControversyRadialChart width={100} height={100} data={testData} />
        )}
      </header>
    </div>
  );
}
export default App;
