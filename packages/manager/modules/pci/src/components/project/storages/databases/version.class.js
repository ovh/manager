import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import 'moment';

import Plan from './plan.class';

export default class Version {
  constructor(version, availabilities, plans, flavors) {
    Object.assign(this, {
      endOfLife: moment(
        get(head(availabilities), 'lifecycle.endOfLife'),
        'YYYY-MM-DD',
      ),
      startDate: moment(
        get(head(availabilities), 'lifecycle.startDate'),
        'YYYY-MM-DD',
      ),
      plans: Version.getPlans(availabilities, plans, flavors),
      status: get(head(availabilities), 'lifecycle.status'),
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

  static getPlans(availabilities, plans, flavors) {
    const groupedAvailabilities = groupBy(availabilities, 'plan.name');
    return plans.reduce((filteredPlans, plan) => {
      const planAvailabilities = groupedAvailabilities[plan.name];
      if (planAvailabilities) {
        filteredPlans.push(new Plan(plan, planAvailabilities, flavors));
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
