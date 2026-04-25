// Custom Hook (useDebounce): The most common "React-native" way is to create a custom hook that uses useEffect and setTimeout to update a value only after the delay expires.
// Improved Performance: Reduces unnecessary re-renders and computations.
// Reduced Server Load: Prevents flooding backends with redundant API calls.
// Better UX: Keeps the interface responsive by prioritizing user interaction over background tasks.
// In React, debouncing is a performance optimization technique used to limit the frequency of function executions. It ensures that a function—such as an API call or expensive calculation—only runs after a specific amount of time has passed since the last event trigger. 

import { useState, useEffect } from "react";

const useDebounce = (value, delay = 400) => {
    // debouncedValue = "delayed copy" of value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Timer start karo
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup — agar value phir change ho toh purana timer cancel
    return () => clearTimeout(timer); // cleanup
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;