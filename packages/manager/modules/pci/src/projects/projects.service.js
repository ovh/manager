import map from 'lodash/map';

import Quota from './quota.class';
import { DEFAULT_PROJECT_KEY } from './projects.constant';

export default class {
  /* @ngInject */
  constructor(ovhUserPref, OvhApiCloudProjectQuota) {
    this.ovhUserPref = ovhUserPref;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
  }

  getDefaultProject() {
    return this.ovhUserPref.getValue(DEFAULT_PROJECT_KEY).catch((err) => {
      if (err.status === 404) {
        return null;
      }
      throw err;
    });
  }

  setAsDefaultProject(projectId) {
    return this.ovhUserPref.create(DEFAULT_PROJECT_KEY, { projectId });
  }

  removeDefaultProject() {
    return this.ovhUserPref.remove(DEFAULT_PROJECT_KEY);
  }

  getQuotas(projectId) {
    return this.OvhApiCloudProjectQuota.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((quotas) => map(quotas, (quota) => new Quota(quota)));
  }
}
