import "./App.css";
import React, { useState, useEffect, SetStateAction } from "react";
import { NewsData, createNewsData } from "./types";
import ControversyRadialChart from "./ControversyRadialChart";
import Spinner from "./Components/Spinner-Tw";
import Select from "./Components/SelectTw";

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

async function fetchAIData(searchTerm: any) {
  console.log("fetchAIData called!");
  console.log(searchTerm);
  const response = await fetch("http://localhost:5000/fetch_AI_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      search_term: searchTerm + "_edu",
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return data; // Assuming your API returns processed data in JSON format
  } else {
    throw new Error("Error fetching data from API");
  }
}

function convertDropdown(selectedOption: string) {
  switch (selectedOption) {
    case "evolution":
      return "Evolution";
    case "critical_race_theory":
      return "Critical Race Theory";
    case "sex_ed":
      return "Sex Education";
    case "civil_war":
      return "Civil War and Slavery";
    default:
      return "Test Data";
  }
}

function App() {
  const [newsData, setNewsData] = useState([] as NewsData[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

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
      console.log("fetchData called!");
      setIsLoading(true);
      setError(null); // Reset errors
      try {
        const data = await fetchAIData(selectedOption);
        const tmp: NewsData[] = Object.keys(data.year).map((index) => {
          return {
            year: data.year[index],
            relevance: data.relevance[index],
            explanation: data.explanation[index],
          };
        });
        console.log("tmp", tmp);
        setNewsData(tmp); // Assign the value of tmp to newsData state variable
      } catch (error: unknown) {
        setError(error as SetStateAction<null>);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOption]); // Fetch data only once on component mount

  // console.log(newsData);
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
      <header>
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center p-10 mt-20 mb-5">
          Can We Teach This? Creative Reflection
        </h1>
        <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white text-center">
          By Gabriel Castejon
        </h2>
        <p className="my-10" />
        <Select
          selectedOption={selectedOption}
          onOptionChange={setSelectedOption}
        />
      </header>
      {/* Conditional Rendering */}

      {isLoading && (
        <div className="p-10 m-10">
          <p>Loading data from Back-End...</p>
          <Spinner />
        </div>
      )}
      {error && (
        <p className="text-red-500 text-4xl text-center my-10 font-bold">
          Error Fetching Data
        </p>
      )}
      {newsData.length > 0 && (
        <>
          <h1 className="text-7xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 text-center mt-20  font-bold">
            {convertDropdown(selectedOption)} Chart
          </h1>
          <ControversyRadialChart width={900} height={900} data={newsData} />
        </>
      )}
      {/* Fallback to test data if needed  */}
      {!newsData && !isLoading && !error && (
        <ControversyRadialChart width={900} height={900} data={testData} />
      )}
    </div>
  );
}
export default App;
