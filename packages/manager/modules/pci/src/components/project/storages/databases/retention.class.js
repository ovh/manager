export default class Retention {
  constructor({
    blockDataExpirationDuration,
    blockSizeDuration,
    bufferFutureDuration,
    bufferPastDuration,
    periodDuration,
  }) {
    Object.assign(this, {
      blockDataExpirationDuration,
      blockSizeDuration,
      bufferFutureDuration,
      bufferPastDuration,
      periodDuration,
    });
  }
}
