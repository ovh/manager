import {
  DEFAULT_ALGORITHM,
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  APP_COOKIE_SESSION_PERSISTENCE,
} from './constants';

export default class OctaviaLoadBalancerPoolFormCtrl {
  $onInit() {
    this.APP_COOKIE_SESSION_PERSISTENCE = APP_COOKIE_SESSION_PERSISTENCE;
    this.model.algorithm =
      this.model.algorithm ||
      this.algorithms.find(
        (algorithm) => algorithm.value === DEFAULT_ALGORITHM,
      );
  }

  onHasSessionChange(hasSession) {
    if (hasSession) {
      this.model.persistentSession = this.sessionPersistenceTypes.find(
        (session) => session.value === DEFAULT_SESSION_PERSISTENCE_TYPE,
      );
    } else {
      this.model.persistentSession = null;
    }
  }

  onPersistentSessionTypeChange(type) {
    if (type?.value !== APP_COOKIE_SESSION_PERSISTENCE) {
      this.model.cookieName = undefined;
    }
  }
}
