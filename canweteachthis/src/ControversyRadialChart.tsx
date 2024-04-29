import { NewsData, createNewsData } from "./types";
import React, { useRef, useState, useEffect } from "react";
import { Group } from "@visx/group";
import { LineRadial } from "@visx/shape";
import { scaleLog, NumberLike, scaleLinear } from "@visx/scale";
import { curveBasisOpen, curveLinearClosed, curveNatural } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { AxisLeft } from "@visx/axis";
import { GridRadial, GridAngle } from "@visx/grid";
import { animated, useSpring } from "@react-spring/web";

// Initial Code Template Derived from Visx LineRadial Example: https://airbnb.io/visx/lineradial
const green = "#FC8E27";
export const blue = "#3019FF";
const darkgreen = "#FF3030";
export const background = "#A6AFFF";
const darkbackground = "#000000";
const black = "#000000";
const strokeColor = "#744cca";
const springConfig = {
  tension: 15,
};

// const NewsData: EvolutionNewsData[] = []; // Initialize with an empty array
//utils:
function extent<Datum>(data: Datum[], value: (d: Datum) => number) {
  const values = data.map(value);
  return [Math.min(...values), Math.max(...values)];
}

// Handle Dynamically later
// const firstPoint = NewsData[0];
// const lastPoint = NewsData[NewsData.length - 1];

export type LineRadialProps = {
  width: number;
  height: number;
  animate?: boolean;
  data: NewsData[];
};

function ControversyRadialChart({
  width,
  height,
  animate = true,
  data,
}: LineRadialProps) {
  const lineRef = useRef<SVGPathElement>(null);
  const [lineLength, setLineLength] = useState<number>(0);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  // Calculate maximum news count dynamically

  // Accessors modified for your data
  const getYear = (d: NewsData) => d.year;
  const getRelevance = (d: NewsData) => d.relevance;
  const getExplanation = (d: NewsData) => d.explanation;
  const formatTicks = (val: NumberLike) => String(val);
  // const maxNewsCount = Math.max(...NewsData.map(getNewsCount));

  // Scales modified for your data
  const xScale = scaleLinear({
    range: [0, Math.PI * 2],
    domain: extent(data, getYear), // Adjust your year range
  });
  // Handle Dynamically later
  // const yScale = scaleLog<number>({
  //   // placeholder for now
  //   domain: extent(data, getRelevance),
  // });

  const angle = (d: NewsData) => xScale(getYear(d)) ?? 0;
  const radius = (d: NewsData) => {
    const relevance = getRelevance(d);
    return yScale(relevance) ?? 0;
  };

  // const radius = (d: NewsData) => yScale(getRelevance(d)) ?? 0;
  const padding = 60;
  const firstYear = data[0].year;
  const lastYear = data[data.length - 1].year;
  console.log("First Year:", data[0].year);
  console.log("Last Year:", data[data.length - 1].year);
  xScale.domain([firstYear, lastYear]);

  const yScale = scaleLog<number>({
    domain: [100, 10], // Domain matches your relevance range
    range: [height / 2 - padding, 0], // Adjust range as per your chart's dimensions
  });

  const minRelevance = Math.min(...data.map(getRelevance));
  const maxRelevance = Math.max(...data.map(getRelevance));
  console.log("Min Relevance:", minRelevance, "Max Relevance:", maxRelevance);
  console.log("yScale Domain:", yScale.domain());

  // const maxNewsCount = Math.max(...data.map(getRelevance));

  // Calculate first and last points dynamically
  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];

  const spring = useSpring({
    frame: shouldAnimate ? 0 : 1,
    config: springConfig,
    onRest: () => setShouldAnimate(false),
  });

  // set line length once it is known after initial render
  const effectDependency = lineRef.current;
  useEffect(() => {
    if (lineRef.current) {
      setLineLength(lineRef.current.getTotalLength());
    }
  }, [effectDependency]);

  if (width < 10) return null;

  // Update scale output to match component dimensions
  const reverseYScale = yScale.copy().range(yScale.range().reverse());
  const handlePress = () => setShouldAnimate(true);
  let isLoading = data.length === 0 ? true : false;
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen p-2">
        {animate && (
          <>
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-4 "
              type="button"
              onClick={handlePress}
              onTouchStart={handlePress}
            >
              Animate
            </button>
            <br />
          </>
        )}
        <svg
          width={width}
          height={height}
          onClick={() => setShouldAnimate(!shouldAnimate)}
        >
          <LinearGradient from={green} to={blue} id="line-gradient" />
          <rect width={width} height={height} fill={background} rx={14} />
          <Group top={height / 2} left={width / 2}>
            <GridAngle
              scale={xScale}
              outerRadius={height / 2 - padding}
              stroke={green}
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeDasharray="5,2"
              numTicks={20}
            />
            <GridRadial
              scale={yScale}
              numTicks={5}
              stroke={blue}
              strokeWidth={1}
              fill={blue}
              fillOpacity={0.1}
              strokeOpacity={0.2}
            />
            <AxisLeft
              top={-height / 2 + padding}
              scale={reverseYScale}
              numTicks={5}
              tickStroke="none"
              tickLabelProps={{
                fontSize: 10,
                fill: darkgreen,
                fillOpacity: 2,
                textAnchor: "middle",
                dx: "1em",
                dy: "-0.5em",
                stroke: strokeColor,
                strokeWidth: 0.5,
                paintOrder: "stroke",
              }}
              tickFormat={formatTicks}
              hideAxisLine
            />
            {data && data.length > 0 ? ( // Conditional Rendering!
              <LineRadial angle={angle} radius={radius} curve={curveNatural}>
                {({ path }) => {
                  console.log("Data received by the path function:", path);
                  const d =
                    path(
                      data.map((d) => ({
                        year: d.year,
                        relevance: d.relevance,
                      }))
                    ) || ""; // Ensure d is valid

                  // console.log("Data received by the path function:", d);
                  return (
                    <>
                      {data.map((d, i) => {
                        const angle = xScale(getYear(d)) ?? 0;
                        const radius = yScale(getRelevance(d) ?? 0); // Place on outer edge

                        // cx={radius * -Math.sin(angle)}
                        // cy={radius * -Math.cos(angle)}

                        const cx = -(radius * Math.sin(angle + Math.PI)); // Add Math.PI
                        const cy = radius * Math.cos(angle + Math.PI); // Add Math.PI
                        return (
                          <circle
                            key={`angle-marker-${i}`}
                            cx={cx}
                            cy={cy}
                            r={3}
                            fill="red"
                          />
                        );
                      })}
                      <animated.path
                        d={d} // produces the incorrect output
                        ref={lineRef}
                        strokeWidth={2}
                        strokeOpacity={0.8}
                        strokeLinecap="round"
                        fill="none"
                        stroke={
                          animate ? darkbackground : "url(#line-gradient)"
                        }
                      />

                      {shouldAnimate && (
                        <animated.path
                          d={d} // produces incorrect output
                          strokeWidth={2}
                          strokeOpacity={0.8}
                          strokeLinecap="round"
                          fill="none"
                          stroke="url(#line-gradient)"
                          strokeDashoffset={spring.frame.interpolate(
                            (v) => v * lineLength
                          )}
                          strokeDasharray={lineLength}
                        />
                      )}
                    </>
                  );
                }}
              </LineRadial>
            ) : (
              // Loading or Error State
              <text x={width / 2} y={height / 2} textAnchor="middle">
                {isLoading ? "Loading..." : "Error fetching data"}
              </text>
            )}

            {data.map((d, i) => {
              const year = getYear(d);
              const angle = xScale(year) ?? 0;
              let radius = yScale(getRelevance(d)) ?? 0;
              if (year == firstYear) {
                radius = height / 2 - padding + 35; // Place labels along the outer edge
              } else {
                radius = height / 2 - padding + 25; // Place labels along the outer edge
              }
              return (
                <text
                  key={`year-label-${i}`}
                  x={radius * Math.sin(angle)}
                  y={radius * -Math.cos(angle)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10px"
                >
                  {year}
                </text>
              );
            })}
            {[firstPoint, lastPoint].map((d, i) => {
              const cx = ((xScale(getYear(d)) ?? 0) * Math.PI) / 180;
              const cy = -yScale(getRelevance(d)) ?? 0;
              return (
                <circle
                  key={`line-cap-${i}`}
                  cx={cx}
                  cy={cy}
                  fill={darkgreen}
                  r={3}
                />
              );
            })}
          </Group>
        </svg>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Explanations
        </h1>
        <p className="text-center text-gray-800 dark:text-white">
          {getExplanation(data[0])}
        </p>
      </div>
    </div>
  );
}

export default ControversyRadialChart;
