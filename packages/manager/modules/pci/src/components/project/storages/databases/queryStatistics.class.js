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
    this.minTime = this.minTime?.toFixed(1);
    this.maxTime = this.maxTime?.toFixed(1);
    this.stddevTime = this.stddevTime?.toFixed(1);
    this.totalTime = this.totalTime?.toFixed(1);
    this.meanTime = this.meanTime?.toFixed(1);
  }
}
