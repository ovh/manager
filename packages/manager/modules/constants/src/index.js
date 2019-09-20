import find from 'lodash/find';
import upperCase from 'lodash/upperCase';

import guides from './urls/guides';
import languages from './languages';
import manager from './urls/manager';
import regions from './regions';
import subs from './subs';
import utils, { findConstants } from './utils';
import website from './urls/website';

export const constants = {
  languages,
  regions,
  subs,
  urls: {
    guides,
    manager,
    website,
  },
};

export const OvhConstants = class {
  constructor(sub) {
    const subName = upperCase(sub);

    this.sub = subs[subName];
    this.region = find(
      regions,
      region => find(
        region.subs,
        currentSub => currentSub === subName,
      ),
    );

    this.urls = findConstants(
      constants.urls,
      {
        region: this.region.name,
        sub: this.sub.name,
      },
    );
  }
};

export default {
  constants,
  OvhConstants,
  constantUtils: utils,
};
