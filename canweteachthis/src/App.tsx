import "./App.css";
import React, { useState, useEffect, SetStateAction } from "react";
import { NewsData, createNewsData } from "./types";
import ControversyRadialChart from "./ControversyRadialChart";

// Unused because News API does not support news data older than a month on the free tier
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

async function fetchAIData(searchTerm: string) {
  const response = await fetch("http://localhost:5000/fetch_AI_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      search_term: searchTerm,
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
  const [newsData, setNewsData] = useState([] as NewsData[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testData: NewsData[] = [
    createNewsData(1950, 10),
    createNewsData(1950, 10),
    createNewsData(1960, 20),
    createNewsData(1970, 30),
    createNewsData(1980, 40),
    createNewsData(1990, 30),
    createNewsData(2000, 20),
    createNewsData(2010, 10),
    createNewsData(2020, 40),
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset errors
      try {
        const data = await fetchAIData("evolution_edu");
        console.log(data);
        const tmp: NewsData[] = data.map(() => {
          return {
            year: data.year,
            relevance: data.relevance,
            explanation: data.explanation,
          };
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     setError(null); // Reset errors
  //     try {
  //       const data = await fetchNewsData("covid", "2024-04-17", "2024-04-17");
  //       console.log(data);
  //       const tmp: EvolutionNewsData[] = data.map(() => {
  //         return { year: data.year, newsCount: data.newsCount };
  //       });
  //       setNewsData(tmp); // Assign the value of tmp to newsData state variable
  //     } catch (error: unknown) {
  //       setError(error as SetStateAction<null>);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []); // Fetch data only once on component mount

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">
          Can We Teach This? Creative Reflection
        </h1>
        {/* Conditional Rendering */}
        {isLoading && <p>Loading data from Back-End...</p>}
        {error && <p>Error fetching data: {error}</p>}
        {newsData && (
          <ControversyRadialChart width={1000} height={1000} data={newsData} />
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
