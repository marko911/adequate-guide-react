import { compose, head, identity, map, prop, sort } from "ramda";
import React, { useEffect, useState } from "react";
import { maybe_ } from "sanctuary";
import { feedParse } from "./api";
import Episode from "./Episode";

const nothing = () => [];
export const parseSubs = maybe_(nothing)(identity);

const eps = [];
const getEps = () => eps;

export default function Dashboard({ subs }) {
  // subs Maybe(subscription)
  const [episodes, setEpisodes] = useState([]);

  useEffect(async () => {
    // get feed for each subscription
    const streams = map(compose(map(feedParse), map(prop("feedUrl"))), subs); // Maybe([Task])

    //------associative--------
    //  map(map(compose(feedParse, prop("feedUrl"))), subs);

    const appendToFeed = (stream) => {
      //this for each happens async
      stream.forEach((item) => {
        if (item.detail) {
          setEpisodes([...getEps(), item.detail]);

          eps.push(item.detail);
        }
      });
    };

    const runTask = (task) => {
      task.run().listen({
        onResolved: appendToFeed,
      });
    };

    map(map(runTask), streams);
  }, [subs]);

  const censoredNameOfFirstSub = map(
    compose(prop("collectionCensoredName"), head),
    subs
  );

  const datediff = function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };

  const sortedEpisodes = sort(datediff, episodes);
  console.log("🚀 ~ xxx", sortedEpisodes);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        Latest added pod:
        {censoredNameOfFirstSub && <h2>{parseSubs(censoredNameOfFirstSub)}</h2>}
      </div>
      {sortedEpisodes.slice(0, 10).map((item, i) => (
        <Episode data={item} key={i} />
      ))}
    </div>
  );
}
