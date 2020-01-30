import find from 'lodash/find';
import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import map from 'lodash/map';

export default class FeatureFlipping {
  constructor(region) {
    this.region = region;
    this.featureList = [];
  }

  addFeature(feature) {
    this.featureList.push(feature);
    return feature;
  }

  addFeatures(featureList) {
    return map(featureList, (feature) => this.addFeature(feature));
  }

  isFeatureActive(key) {
    const feature = find(this.featureList, {
      key,
    });
    const { active } = feature;

    if (isBoolean(active)) {
      return active;
    }

    const { region } = active;
    let regionRuleApplied = false;

    if (isArray(region)) {
      regionRuleApplied = region.includes(this.region);
    } else {
      regionRuleApplied = region === this.region;
    }

    return regionRuleApplied;
  }
}
