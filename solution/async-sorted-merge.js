"use strict";

const MinHeap = require("../lib/min-heap");

/**
 * Print all entries, across all of the *async* sources, in chronological order.
 * 
 * Assumptions:
 *   We are guaranteed that our promises return and won't block the execution of our code. Otherwise we would use Promise.race
 *   Each log source always returns its logs in chronological order
 *   Each Log has a 'date' that is the comparator key to determine chronological order
 *   There are 5,000,000 or fewer log sources (Tested M1 Macbook Pro 32GB)
 */
const asyncSortedMerge = async (logSources, printer) => {

  const MAX_QUEUE_PREFETCH_AMOUNT = 200;

  const logMinHeap = new MinHeap();
  const resourceTracker = [];

  const addResultToResourceTracker = (index, result) => {
    resourceTracker[index] = {
      promise: undefined,
      results: [...resourceTracker[index].results, result],
      isEmpty: false,
    };
  };

  const addResultToMinHeap = (index, result) => {
    logMinHeap.add({
      value: result.date,
      log: result,
      index,
    });
  }

  const markLogSourceAsEmpty = (index) => {
    resourceTracker[index] = {
      promise: undefined,
      results: resourceTracker[index].results,
      isEmpty: true,
    };
  };

  const fetchAndProcessNextRound = () => {
    return resourceTracker.map( (resource, index) => {

      if (resource.promise !== undefined && resource.results.length === 0) {
        return resource.promise;
      }
      if (resource.results.length >= MAX_QUEUE_PREFETCH_AMOUNT || resource.isEmpty ) {
        return Promise.resolve();
      }

      if (!resource.promise) {
        const logPromise = logSources[index].popAsync();
        resource.promise = logPromise;
        logPromise.then(nextLog => {
          if (nextLog) {
            addResultToMinHeap(index, nextLog);
            addResultToResourceTracker(index, nextLog);
          }
          else {
            markLogSourceAsEmpty(index);
          }
        }).catch( error => {
          markLogSourceAsEmpty(index);
        });
        return logPromise;
      }
      
      return Promise.resolve();
    });
  };


  (logSources || []).forEach( logSource => {
    resourceTracker.push({
      promise: undefined,
      results: [],
      isEmpty: false
    })
  });

  const firstRoundPromises = fetchAndProcessNextRound();
  await Promise.allSettled(firstRoundPromises);

  while (!logMinHeap.isEmpty()) {
    const {log, index} = logMinHeap.remove();
    printer.print(log);
    resourceTracker[index].results.shift();
    await Promise.allSettled(fetchAndProcessNextRound());
  }
  printer.done();
  return console.log("Async sort complete.");
};

module.exports = asyncSortedMerge;
