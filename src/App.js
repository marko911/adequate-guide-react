import React, { useEffect, useState } from "react";
import { Just, concat, Maybe, of } from "sanctuary";
import { Nothing } from "sanctuary-maybe";

import "./App.css";
import Feed, { parseSubs } from "./Feed";
import Header from "./Header";
import Search from "./Search";

function App() {
  const [subs, setSubs] = useState(Nothing);
  useEffect(() => {
    const storedSubs = JSON.parse(localStorage.getItem("subs"));
    setSubs(of(Maybe)(storedSubs));
  }, []);

  const handleSave = (data) => () => {
    const newSubs = concat(Just([data]))(subs);

    setSubs(newSubs);
    localStorage.setItem("subs", JSON.stringify(parseSubs(newSubs)));
  };

  const [page, setPage] = useState("feed");
  const goPage = (page) => () => setPage(page);

  return (
    <div>
      <Header goPage={goPage} page={page} />
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8 h-full">
        {page === "search" ? (
          <Search handleSave={handleSave} />
        ) : (
          <Feed subs={subs} /> //because subs is a Maybe - parse to extract
        )}
      </div>
    </div>
  );
}

export default App;
