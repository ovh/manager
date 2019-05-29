import { DEFAULT_PROJECT_KEY } from './edit.constant';

export default class {
  /* @ngInject */
  constructor(ovhUserPref) {
    this.ovhUserPref = ovhUserPref;
  }

  getDefaultProject() {
    return this.ovhUserPref.getValue(DEFAULT_PROJECT_KEY)
      .catch((err) => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}
