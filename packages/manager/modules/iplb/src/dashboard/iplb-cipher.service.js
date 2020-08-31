import map from 'lodash/map';

export default class IpLoadBalancerCipherService {
  /* @ngInject */
  constructor($translate, OvhApiIpLoadBalancing, CucServiceHelper) {
    this.$translate = $translate;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucServiceHelper = CucServiceHelper;
  }

  getCipher(serviceName) {
    return this.IpLoadBalancing.v6()
      .get({ serviceName })
      .$promise.then((response) =>
        this.transformCipher(response.sslConfiguration),
      )
      .catch(
        this.CucServiceHelper.errorHandler(
          'iplb_modal_cipher_change_loading_error',
        ),
      );
  }

  getCipherTypes() {
    return this.IpLoadBalancing.v6()
      .schema()
      .$promise.then((response) => {
        const types =
          response.models['ipLoadbalancing.SslConfigurationEnum'].enum;
        const mappedTypes = map(types, (type) => this.transformCipher(type));

        return mappedTypes;
      })
      .catch(
        this.CucServiceHelper.errorHandler(
          'iplb_modal_cipher_change_loading_error',
        ),
      );
  }

  transformCipher(cipher) {
    return {
      type: cipher,
      displayName: cipher
        ? this.$translate.instant(
            `iplb_modal_cipher_change_cipher_${cipher}_title`,
          )
        : '',
      description: cipher
        ? this.$translate.instant(
            `iplb_modal_cipher_change_cipher_${cipher}_description`,
          )
        : null,
    };
  }

  updateCipher(serviceName, newCipher) {
    return this.IpLoadBalancing.v6()
      .put({ serviceName }, { sslConfiguration: newCipher })
      .$promise.then((response) => response)
      .catch(
        this.CucServiceHelper.errorHandler(
          'iplb_modal_cipher_change_updating_error',
        ),
      );
  }
}
