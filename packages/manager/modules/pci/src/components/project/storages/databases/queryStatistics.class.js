export default class QueryStatistics {
  constructor(
    query,
    rows,
    calls,
    minTime,
    maxTime,
    meanTime,
    stddevTime,
    totalTime,
  ) {
    Object.assign(this, {
      query,
      rows,
      calls,
      minTime,
      maxTime,
      meanTime,
      stddevTime,
      totalTime,
    });
  }
}
