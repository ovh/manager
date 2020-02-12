import get from 'lodash/get';
import set from 'lodash/set';

export default class PrivateRegistry {
  constructor(resource) {
    Object.assign(this, resource);
    set(this, 'plan.displayName', get(this, 'plan.name[0]'));
  }

  get limit() {
    return get(this, 'plan.registryLimits.imageStorage', 0);
  }
}
