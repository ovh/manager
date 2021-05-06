import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import 'moment';

import Plan from './plan.class';

export default class Version {
  constructor(version, availability, plans, flavors) {
    Object.assign(this, {
      endOfLife: moment(get(head(availability), 'endOfLife'), 'YYYY-MM-DD'),
      startDate: moment(get(head(availability), 'startDate'), 'YYYY-MM-DD'),
      plans: Version.getPlans(availability, plans, flavors),
      version,
    });
  }

  get isNew() {
    return this.startDate.isAfter(moment().subtract(3, 'month'));
  }

  get isGettingDeprecated() {
    return this.endOfLife.isBefore(moment().add(6, 'month'));
  }

  get versionParts() {
    return this.version.split('.').map((part) => parseInt(part, 10));
  }

  static getPlans(availability, plans, flavors) {
    const groupedAvailability = groupBy(availability, 'plan.name');
    return plans.reduce((filteredPlans, plan) => {
      const planAvailability = groupedAvailability[plan.name];
      if (planAvailability) {
        filteredPlans.push(new Plan(plan, planAvailability, flavors));
      }
      return filteredPlans;
    }, []);
  }

  compare(version) {
    // greater than 0 if current plan is the lower one
    // less than 0 if current plan is the higher one
    // 0 if equal
    if (!version) return -1;
    for (
      let partIndex = 0;
      partIndex < this.versionParts.length;
      partIndex += 1
    ) {
      const versionDiff =
        version.versionParts[partIndex] - this.versionParts[partIndex];
      if (versionDiff !== 0) {
        return versionDiff;
      }
    }
    return 0;
  }

  getDefaultPlan(selectedPlan) {
    return this.plans.includes(selectedPlan)
      ? selectedPlan
      : find(this.plans, 'isDefault');
  }

  getPlan(planName) {
    return find(this.plans, { name: planName });
  }
}
