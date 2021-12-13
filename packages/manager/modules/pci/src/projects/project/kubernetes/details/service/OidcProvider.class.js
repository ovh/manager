import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

export default class OidcProvider {
  /**
   * Create a OIDC Provider instance
   * @param oidcProviderModel {Object}: native oidcProvider JS object
   * */
  constructor(oidcProviderModel) {
    Object.assign(this, oidcProviderModel);
  }

  isDefined() {
    const { clientId, issuerUrl } = this;
    return !isEmpty(clientId) && !isEmpty(issuerUrl);
  }

  copy() {
    return new OidcProvider(cloneDeep(this));
  }
}
