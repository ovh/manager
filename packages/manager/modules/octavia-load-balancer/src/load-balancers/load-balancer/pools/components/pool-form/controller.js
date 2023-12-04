import {
  DEFAULT_ALGORITHM,
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  APP_COOKIE_SESSION_PERSISTENCE,
  PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION,
} from './constants';

export default class OctaviaLoadBalancerPoolFormCtrl {
  $onInit() {
    this.APP_COOKIE_SESSION_PERSISTENCE = APP_COOKIE_SESSION_PERSISTENCE;
    if (!this.model.algorithm?.value) {
      this.model.algorithm = this.algorithms.find(
        ({ value }) => value === (this.model.algorithm || DEFAULT_ALGORITHM),
      );
    }
    if (this.model.persistentSession?.type) {
      this.model.persistentSession = this.sessionPersistenceTypes.find(
        (session) => session.value === this.model.persistentSession.type,
      );
    }
    this.availableSessionPersistenceTypes = this.getFilteredSessionPersistenceTypes(
      this.model.protocol,
    );
  }

  onProtocolChange(protocol) {
    this.availableSessionPersistenceTypes = this.getFilteredSessionPersistenceTypes(
      protocol,
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

  getFilteredSessionPersistenceTypes(protocol) {
    return this.sessionPersistenceTypes.filter(
      (type) =>
        type.value !== 'disabled' &&
        (!protocol ||
          PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION[protocol].includes(
            type.value,
          )),
    );
  }
}
