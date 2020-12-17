// import { compose, head, identity, map, prop, sort } from "ramda";
import React, { useEffect, useState } from "react";
import { maybe_ } from "sanctuary";

import { map, prop, sort, head, identity, compose, thunkify } from "ramda";
import { feedParse } from "./api";
import Episode from "./Episode";
import { empty } from "most";

const log = (x) => {
  console.log("log: ", x);
  return x;
};

const nothing = () => [];

export const parseSubs = maybe_(nothing)(identity);

const noSubs = () => "No podcasts added, use search to add";
const parseLatestTitle = maybe_(noSubs)((title) => (
  <div>
    <span>Latest pod added: {title}</span>
    <h2>Showing 10 latest episodes</h2>
  </div>
));

export default function Dashboard({ subs }) {
  // subs Maybe(subscription)
  const [episodes, setEpisodes] = useState([]);
  const [done, setDone] = useState(false);
  const [finalStream, setFinalStream] = useState(empty());

  useEffect(() => {
    console.log({ done });
    if (done) {
      finalStream.forEach((item) => {
        if (item.detail) {
          setEpisodes((old) => [...old, item.detail]);
        }
      });
    }
  }, [finalStream, done]);

  useEffect(async () => {
    // get feed for each subscription
    const maybeStreams = map(map(compose(feedParse, prop("feedUrl"))), subs);

    // put all epsiodes from each subscription into one array
    // for rendering
    const appendToFeed = (stream = []) => {
      setFinalStream(finalStream.concat(stream));
    };

    const runTask = (task) => {
      task.run().listen({
        onResolved: appendToFeed,
      });
    };
    // unwrap task from Maybe
    map(compose(thunkify(setDone)(true), map(runTask)), maybeStreams);
  }, [subs]);

  const censoredNameOfFirstSub = map(compose(prop("collectionCensoredName"), head), subs);

  const datediff = function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };

  const sortedEpisodes = sort(datediff, episodes);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">{parseLatestTitle(censoredNameOfFirstSub)}</div>
      {sortedEpisodes.slice(0, 10).map((item, i) => (
        <Episode data={item} key={i} />
      ))}
    </div>
  );
}
