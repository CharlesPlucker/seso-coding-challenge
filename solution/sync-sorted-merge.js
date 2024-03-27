"use strict";

const MinHeap = require("../lib/min-heap");

/**
 * Print all entries, across all of the sources, in chronological order.
 * 
 * Assumptions:
 *   The logSources are already sorted in chronological order
 *   Each Log has a 'date' that is the comparator key to determine chronological order
 */
const syncSortedMerge = (logSources, printer) => {

  const logMinHeap = new MinHeap();

  (logSources || []).forEach(logSource => {
    const nextLog = logSource.pop();
    if (nextLog) {
      logMinHeap.add({
        value: nextLog.date,
        log: nextLog,
        source: logSource})
      }
  });

  while (!logMinHeap.isEmpty()) {
    const {log, source} = logMinHeap.remove();
    printer.print(log);

    const nextLog = source.pop();
    if (nextLog) {
      logMinHeap.add({
        value: nextLog.date,
        log: nextLog,
        source})
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};

module.exports = syncSortedMerge;
