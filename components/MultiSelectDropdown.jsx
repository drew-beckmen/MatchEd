// Source: https://github.com/prutya/tutorial-multi-select-dropdown/blob/main/src/components/MultiSelectDropdown.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function MultiSelectDropdown({
  formFieldName,
  options,
  onChange,
  prompt = "Select one or more options",
}) {
  const [isJsEnabled, setIsJsEnabled] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const optionsListRef = useRef(null);

  useEffect(() => {
    setIsJsEnabled(true);
  }, []);

  const handleChange = (e) => {
    const isChecked = e.target.checked;
    const option = e.target.value;

    const selectedOptionSet = new Set(selectedOptions);

    if (isChecked) {
      selectedOptionSet.add(option);
    } else {
      selectedOptionSet.delete(option);
    }

    const newSelectedOptions = Array.from(selectedOptionSet);

    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const isSelectAllEnabled = selectedOptions.length < options.length;

  const handleSelectAllClick = (e) => {
    e.preventDefault();

    const optionsInputs = optionsListRef.current.querySelectorAll("input");
    optionsInputs.forEach((input) => {
      input.checked = true;
    });

    setSelectedOptions([...options]);
    onChange([...options]);
  };

  const isClearSelectionEnabled = selectedOptions.length > 0;

  const handleClearSelectionClick = (e) => {
    e.preventDefault();

    const optionsInputs = optionsListRef.current.querySelectorAll("input");
    optionsInputs.forEach((input) => {
      input.checked = false;
    });

    setSelectedOptions([]);
    onChange([]);
  };

  return (
    <label className="relative">
      <input type="checkbox" className="hidden peer" />

      <div className="flex justify-between cursor-pointer border rounded  px-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 mt-2">
        <p className="self-center">{prompt}</p>
        {isJsEnabled && selectedOptions.length > 0 && (
          <span className="ml-1 text-blue-500">{`(${selectedOptions.length} selected)`}</span>
        )}
        <ChevronDownIcon className="h-5 w-5 text-gray-400 self-center" />
      </div>

      <div className="absolute bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto w-full max-h-60 overflow-y-scroll">
        {isJsEnabled && (
          <ul>
            <li>
              <button
                onClick={handleSelectAllClick}
                disabled={!isSelectAllEnabled}
                className="w-full text-left px-2 text-blue-600 disabled:opacity-50 text-sm"
              >
                {"Select All"}
              </button>
            </li>
            <li>
              <button
                onClick={handleClearSelectionClick}
                disabled={!isClearSelectionEnabled}
                className="w-full text-left px-2 py-1 text-blue-600 disabled:opacity-50 text-sm"
              >
                {"Clear selection"}
              </button>
            </li>
          </ul>
        )}
        <ul ref={optionsListRef}>
          {options.map((option, i) => {
            return (
              <li key={option}>
                <label
                  className={`flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200`}
                >
                  <input
                    type="checkbox"
                    name={formFieldName}
                    value={option}
                    className="cursor-pointer self-center	"
                    onChange={handleChange}
                  />
                  <span className="ml-1 text-sm">Student {option}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </label>
  );
}
