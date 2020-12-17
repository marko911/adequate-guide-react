import React from "react";
import { ClearBtn, SearchBtn } from "./Buttons";
import SearchResult from "./Result";
import ResultsTable from "./ResultsTable";
import { assoc, compose, curry, dissoc, flatten, map, path, prop, propEq } from "ramda";
import { useState } from "react";
import { either, maybe_ } from "sanctuary";

import { fetchMedia } from "./api";

const none = () => [];

// const isPodcast = propEq("kind", "podcast");
// const renameKey = curry((oldKey, newKey, obj) =>
//   assoc(newKey, prop(oldKey, obj), dissoc(oldKey, obj))
// );

const err = (err) => {
  return [];
};

const success = path(["data", "results"]);

// if we wanna consolidate ----

// const successFormatted = compose(
//   map((res) =>
//     isPodcast(res) ? res : renameKey("collectionName", "trackName", res)
//   ),
//   success
// );

const parseResponse = maybe_(none)(either(err)(success));

export default function Search({ subs, saveSub }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const fetchBoth = async (e) => {
    e.preventDefault();
    const combineResults = curry((pods, audiobooks) => {
      return compose(flatten, map(parseResponse))([pods, audiobooks]);
    });

    const liftA2 = curry((g, f1, f2) => {
      return f1.map(g).ap(f2);
    });

    const otherTasks = liftA2(
      combineResults,
      fetchMedia({ term: query, media: "podcast" }),
      fetchMedia({ term: query, media: "audiobook" })
    );

    otherTasks.run().listen({
      onRejected: (val) => {
        console.error(val);
      },
      onResolved: setResults,
    });
  };

  return (
    <>
      <div className="max-w-2xl ">
        <div className="my-5 h-10">
          <div className="h-full flex rounded-md">
            <form onSubmit={fetchBoth} className="h-full flex rounded-md">
              <input
                type="text"
                name="company_website"
                id="company_website"
                value={query}
                onChange={({ target }) => setQuery(target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full  rounded-md sm:text-sm border-gray-300 shadow-sm"
                placeholder="Search podcasts and audiobooks"
              />
              <SearchBtn onClick={fetchBoth} />
              <ClearBtn onClick={() => setResults([])} />
            </form>
          </div>
        </div>
      </div>

      <ResultsTable>
        {results.map((data) => (
          <SearchResult key={data.collectionId} data={data} onSave={saveSub} />
        ))}
      </ResultsTable>
    </>
  );
}
