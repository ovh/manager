import 'moment';
import find from 'lodash/find';
import some from 'lodash/some';

import Version from './version.class';

export default class Engine {
  constructor(
    { name, versions, defaultVersion, description },
    availability,
    plans,
    flavors,
  ) {
    Object.assign(this, {
      name,
      defaultVersion,
      description,
    });

    this.versions = versions.map((version) => {
      return new Version(
        version,
        availability.filter(
          (plan) => plan.engine === this.name && plan.version === version,
        ),
        plans,
        flavors,
      );
    });

    this.selectedVersion = find(this.versions, {
      version: this.defaultVersion,
    });

    this.isDefault = some(availability, 'default');
  }

  getVersion(versionName) {
    return find(this.versions, { version: versionName });
  }

  getPlan(versionName, planName) {
    return this.getVersion(versionName).getPlan(planName);
  }

  getPlans(versionName) {
    return this.getVersion(versionName).plans;
  }

  getLatestVersion() {
    return this.versions.reduce((latestVersion, version) =>
      version.compare(latestVersion) < 0 ? version : latestVersion,
    );
  }

  getHighestFlavor(versionName, regionName, planName) {
    return this.getRegion(
      versionName,
      planName,
      regionName,
    ).flavors.sort((a, b) => a.compare(b))[0];
  }

  getAvailablePlans(versionName, regionName) {
    return this.getPlans(versionName).filter((plan) =>
      plan.getRegion(regionName),
    );
  }

  getLatestPlan(versionName, regionName) {
    return this.getAvailablePlans(
      versionName,
      regionName,
    ).reduce((latestPlan, plan) =>
      plan.compare(latestPlan) < 0 ? plan : latestPlan,
    );
  }

  getFlavor(versionName, planName, regionName, flavorName) {
    return this.getPlan(versionName, planName)
      .getRegion(regionName)
      .getFlavor(flavorName);
  }

  getRegion(versionName, planName, regionName) {
    return this.getPlan(versionName, planName).getRegion(regionName);
  }
}
