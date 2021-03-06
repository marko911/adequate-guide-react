import React, { useEffect, useState } from "react";
import { maybe_ } from "sanctuary";

import { map, prop, sort, head, identity, compose, thunkify } from "ramda";
import { feedParse } from "./api";
import Episode from "./Episode";
import { empty } from "most";

const nothing = () => [];

export const parseSubs = maybe_(nothing)(identity);

const noSubs = () => "No podcasts added, use search to add";
const parseLatestTitle = maybe_(noSubs)((title) => (
  <div>
    <span>Latest pod added: {title}</span>
    <h2>Showing 10 latest episodes</h2>
  </div>
));

export default function Feed({ subs }) {
  // subs Maybe(subscription)
  const [episodes, setEpisodes] = useState([]);
  const [done, setDone] = useState(false);
  const [finalStream, setFinalStream] = useState(empty());

  useEffect(() => {
    if (done) {
      // the consolidated finalStream now defines how to handle all items read from stream
      // which we just add to a single array
      finalStream.forEach((item) => {
        if (item.detail) {
          setEpisodes((old) => [...old, item.detail]);
        }
      });
    }
  }, [finalStream, done]);

  useEffect(() => {
    // get feed for each subscription
    const maybeTasksOfStreams = map(map(compose(feedParse, prop("feedUrl"))), subs);

    // each stream object gets merged into one
    const appendToFeed = (stream = []) => {
      setFinalStream(finalStream.concat(stream));
    };

    const runTask = (task) => {
      task.run().listen({
        onResolved: appendToFeed,
      });
    };

    // unwrap tasks from Maybe, await each task, signal to our component we are done
    map(compose(thunkify(setDone)(true), map(runTask)), maybeTasksOfStreams);
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
