import { NewsData, createNewsData } from "./types";
import React, { useRef, useState, useEffect } from "react";
import { Group } from "@visx/group";
import { LineRadial } from "@visx/shape";
import { scaleTime, scaleLog, NumberLike } from "@visx/scale";
import { curveBasisOpen } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { AxisLeft } from "@visx/axis";
import { GridRadial, GridAngle } from "@visx/grid";
import { animated, useSpring } from "@react-spring/web";
import { extent } from "d3-array"; // Import the extent function from d3-array

// Initial Code Template Derived from Visx LineRadial Example: https://airbnb.io/visx/lineradial
const green = "#e5fd3d";
export const blue = "#aeeef8";
const darkgreen = "#dff84d";
export const background = "#744cca";
const darkbackground = "#603FA8";
const strokeColor = "#744cca";
const springConfig = {
  tension: 20,
};

// const NewsData: EvolutionNewsData[] = []; // Initialize with an empty array

// Accessors modified for your data
const getYear = (d: NewsData) => d.year;
const getRelevance = (d: NewsData) => d.relevance;
const getExplanation = (d: NewsData) => d.explanation;
const formatTicks = (val: NumberLike) => String(val);
// const maxNewsCount = Math.max(...NewsData.map(getNewsCount));

// Scales modified for your data
const xScale = scaleTime({
  range: [0, Math.PI * 2],
  domain: [1950, 2024], // Adjust your year range
});
// Handle Dynamically later
const yScale = scaleLog<number>({
  // placeholder for now
  domain: extent([0, 1000]) as [number, number],
});

const angle = (d: NewsData) => xScale(getYear(d)) ?? 0;
const radius = (d: NewsData) => yScale(getRelevance(d)) ?? 0;
const padding = 20;

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
  console.log(data);
  const maxNewsCount = Math.max(...data.map(getRelevance));
  yScale.domain([0, maxNewsCount]);

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

  return (
    <>
      {animate && (
        <>
          <button
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
              fontSize: 8,
              fill: blue,
              fillOpacity: 1,
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
          <LineRadial angle={angle} radius={radius} curve={curveBasisOpen}>
            {({ path }) => {
              const d = path(data) || "";
              return (
                <>
                  <animated.path
                    d={d}
                    ref={lineRef}
                    strokeWidth={2}
                    strokeOpacity={0.8}
                    strokeLinecap="round"
                    fill="none"
                    stroke={animate ? darkbackground : "url(#line-gradient)"}
                  />
                  {shouldAnimate && (
                    <animated.path
                      d={d}
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

          {[firstPoint, lastPoint].map((d, i) => {
            const cx = ((xScale(getYear(d)) ?? 0) * Math.PI) / 180;
            const cy = -(yScale(getRelevance(d)) ?? 0);
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
    </>
  );
}

export default ControversyRadialChart;
