"use strict";

const MinHeap = require("../lib/min-heap");

/**
 * Print all entries, across all of the *async* sources, in chronological order.
 * 
 * Assumptions:
 *   We are guaranteed that our promises return and won't block the ececution of our code. Otherwise we would use Promise.race
 *   Each log source always returns its logs in chronological order
 *   Each Log has a 'date' that is the comparator key to determine chronological order
 *   There are 5,000,000 or fewer log sources (Tested M1 Macbook Pro 32GB)
 */
const asyncSortedMerge = async (logSources, printer) => {

  const QUEUE_PREFETCH_AMOUNT = 5;

  const promises = [];
  const logMinHeap = new MinHeap();

  (logSources || []).forEach( logSource => {
    try {
      const logPromise = logSource.popAsync();
      promises.push(logPromise);
    }
    catch (e) {
      promises.push(Promise.resolve());
      resourceTracker.push({
        promises: [logPromise],
        count: 0,
        isEmpty: true // stop using this log source since it has errored
      })
    }
  });

  const promiseResults = await Promise.allSettled(promises);

  promiseResults.forEach((promiseResult, index) => {
    if (promiseResult.status === 'fulfilled') {
      logMinHeap.add({
        value: promiseResult.value.date,
        log: promiseResult.value,
        source: logSources[index],
      });
    }
  });

  while (!logMinHeap.isEmpty()) {
    const {log, source} = logMinHeap.remove();
    printer.print(log);
    let nextLog;
    try {
      nextLog = await source.popAsync();
    }
    catch (e) { }
    if (nextLog) {
      logMinHeap.add({
        value: nextLog.date,
        log: nextLog,
        source
      });
    }
  }
  printer.done();
  return console.log("Async sort complete.");
};

module.exports = asyncSortedMerge;
