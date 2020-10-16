export default class Engagement {
  constructor({ currentPeriod }) {
    Object.assign(this, {
      currentPeriod,
    });
  }

  get endDate() {
    return moment(this.currentPeriod.endDate).format('LL');
  }

  hasEnded() {
    return moment().isAfter(moment(this.currentPeriod.endDate));
  }
}
