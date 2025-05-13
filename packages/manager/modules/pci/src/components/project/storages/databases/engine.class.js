import 'moment';
import find from 'lodash/find';
import some from 'lodash/some';

import {
  ENGINES_STATUS,
  ENGINES_NAMES,
  ENGINES_STORAGE_MODES,
} from './engines.constants';

import Version from './version.class';

export default class Engine {
  constructor(
    { name, versions, defaultVersion, description, storage },
    availabilities,
    plans,
    flavors,
  ) {
    Object.assign(this, {
      name,
      defaultVersion,
      description,
      storage,
    });

    this.versions = versions
      .map((version) => {
        return new Version(
          version,
          availabilities.filter(
            (plan) => plan.engine === this.name && plan.version === version,
          ),
          plans,
          flavors,
        );
      })
      .filter((version) => version.plans.length !== 0)
      .sort((a, b) => b.compare(a));

    this.selectedVersion = find(this.versions, {
      version: this.defaultVersion,
    });

    this.isDefault = some(
      availabilities,
      (availability) => availability.default && availability.engine === name,
    );

    this.isBeta = some(
      availabilities,
      (availability) =>
        availability.lifecycle.status === ENGINES_STATUS.BETA &&
        availability.engine === name,
    );

    this.isDistributedStorage =
      this.storage === ENGINES_STORAGE_MODES.distributed;
  }

  getLabel() {
    return ENGINES_NAMES[this.name];
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

  getHighestFlavorRange(versionName, regionName, planName) {
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

  getDefaultPlan() {
    const defaultPlan = find(this.selectedVersion.plans, 'isDefault');
    return defaultPlan || this.selectedVersion.plans[0];
  }
}
