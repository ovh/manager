export default class EngagementConfiguration {
  constructor({ duration, type }) {
    Object.assign(this, {
      duration,
      type,
    });
  }

  isPeriodic() {
    return this.type === 'periodic';
  }

  isUpfront() {
    return this.type === 'upfront';
  }

  getDuration() {
    return moment.duration(this.duration).asMonths();
  }
}
