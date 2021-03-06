import axios from "axios";
import Task, { task } from "folktale/concurrency/task";
import { Left, Right } from "sanctuary-either";
import FeedParser from "feedparser";
import stringToStream from "string-to-stream";

import { fromEvent } from "most";

const SEARCH_URL = "https://itunes.apple.com/search";

export const fetchMedia = ({ term, media, limit = 5 }) =>
  term
    ? task(async (resolver) => {
        try {
          const response = await axios.get(SEARCH_URL, {
            params: { term, media, limit },
          });

          resolver.resolve(Right(response));
        } catch (err) {
          console.log("🚀 ~ file: index.js ~ line 24 ~ ?task ~ err", err);
          resolver.resolve(Left(err));
        }
      })
    : Task.of(Left(null));

export const feedParse = (feedUrl) => {
  return task(async (resolver) => {
    const feedparser = new FeedParser();
    let response;
    try {
      response = await axios({
        method: "GET",
        url: feedUrl,
        responseType: "stream",
      });
    } catch (err) {
      //retry using proxy for cors sensitive feeds
      response = await axios({
        method: "GET",
        url: `https://cors-anywhere.herokuapp.com/${feedUrl}`,
        responseType: "stream",
      });
    }

    if (!response) {
      console.log("No response!");
      return;
    }

    const event = () =>
      new CustomEvent("episode", { detail: feedparser.read() });
    const myTarget = new EventTarget();
    const myStream = fromEvent("episode", myTarget);

    let counter = 0;

    feedparser.on("readable", function () {
      counter++;
      if (counter > 10) {
        return;
      }
      const newItemEv = event();

      myTarget.dispatchEvent(newItemEv);
    });

    stringToStream(response.data).pipe(feedparser);

    resolver.resolve(myStream);
  });
};
