import React, { FC } from "react";

interface SelectProps {
  selectedOption: string;
  onOptionChange: (newValue: string) => void;
}

const Select: FC<SelectProps> = ({ selectedOption, onOptionChange }) => {
  return (
    <div>
      <form className="max-w-sm mx-auto">
        <label
          htmlFor="Education-Topics"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an education topic to go over:
        </label>
        <select
          id="Education-Topics"
          value={selectedOption} // Control the select's value
          onChange={(e) => onOptionChange(e.target.value)} // Update state on change
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Choose an option</option>
          <option value="evolution">Evolution</option>
          <option value="sex_ed">Sex-Ed</option>
          <option value="civil_war">Civil War and Slavery</option>
          <option value="critical_race_theory">Critical Race Theory</option>
        </select>
      </form>
    </div>
  );
};

export default Select;
