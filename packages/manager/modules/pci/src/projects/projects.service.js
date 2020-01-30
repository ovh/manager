import { DEFAULT_PROJECT_KEY } from './projects.constant';

export default class {
  /* @ngInject */
  constructor(ovhUserPref) {
    this.ovhUserPref = ovhUserPref;
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
}
