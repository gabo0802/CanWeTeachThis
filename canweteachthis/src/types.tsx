export interface NewsData {
  year: number;
  relevance: number;
  explanation?: string;
}

const defaultExplanation = "N/A";

export const createNewsData = (
  year: number,
  relevance: number,
  explanation?: string
): NewsData => {
  return {
    year,
    relevance,
    explanation: explanation || defaultExplanation,
  };
};
