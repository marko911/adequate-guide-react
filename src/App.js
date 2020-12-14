// import {  } from "ramda";
import { useEffect, useState } from "react";
import { Just, Nothing, concat } from "sanctuary";

import "./App.css";
import Dashboard, { parseSubs } from "./Dashboard";
import Header from "./Header";
import Search from "./Search";

function App() {
  const [subs, setSubs] = useState(Nothing);

  useEffect(() => {
    const storedSubs = JSON.parse(localStorage.getItem("subs"));
    if (storedSubs) {
      setSubs(Just(storedSubs));
    } else {
      setSubs(Nothing);
    }
  }, []);

  const handleSave = (data) => () => {
    const newSubs = concat(Just([data]), subs);

    setSubs(newSubs);
    localStorage.setItem("subs", JSON.stringify(parseSubs(newSubs)));
  };

  const [page, setPage] = useState("search");
  const goPage = (page) => () => setPage(page);

  return (
    <div className="bg-gray-100">
      <Header goPage={goPage} page={page} />
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8 h-full">
        {page === "search" ? (
          <Search saveSub={handleSave} />
        ) : (
          <Dashboard subs={subs} /> //because subs is a Maybe - parse to extract
        )}
      </div>
    </div>
  );
}

export default App;
