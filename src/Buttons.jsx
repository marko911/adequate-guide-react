import React from "react";

export function ClearBtn(props) {
  return (
    <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3 inline-flex rounded-md shadow">
      <button
        type="button"
        {...props}
        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
      >
        Clear
      </button>
    </div>
  );
}

export function SearchBtn(props) {
  return (
    <span className="sm:ml-3 self-center">
      <button
        {...props}
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Search
      </button>
    </span>
  );
}
