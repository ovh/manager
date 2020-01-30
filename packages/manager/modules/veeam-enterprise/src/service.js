import get from 'lodash/get';

export default class VeeamEnterpriseService {
  /* @ngInject */
  constructor($q, $translate, OvhApiVeeamEnterprise) {
    this.$q = $q;
    this.$translate = $translate;
    this.veeamEnterprise = OvhApiVeeamEnterprise.v6();

    this.unitOfWork = {};
    this.unitOfWork.init = () => {
      this.unitOfWork.messages = [];
    };
  }

  getConfigurationInfos(serviceName) {
    return this.veeamEnterprise
      .get({ serviceName })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response,
          this.$translate.instant(
            'veeam_enterprise_infos_configuration_load_error',
          ),
        ),
      );
  }

  getSubscriptionInfos(serviceName) {
    return this.veeamEnterprise
      .getServiceInfos({ serviceName })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant(
            'veeam_enterprise_infos_subscription_load_error',
          ),
        ),
      );
  }

  postConfiguration(action, serviceName, ip, port, username, password) {
    if (action === 'register') {
      return this.veeamEnterprise
        .register(
          { serviceName },
          {
            ip,
            port,
            username,
            password,
          },
        )
        .$promise.then((response) =>
          this.acceptResponse(
            response,
            this.$translate.instant(
              'veeam_enterprise_infos_license_register_success',
            ),
          ),
        )
        .catch((response) => {
          const alreadyRegistered =
            get(response, 'data.message') ===
            'This backup server enterprise has already been registered';
          const message = alreadyRegistered
            ? this.$translate.instant(
                'veeam_enterprise_infos_license_already_registered_error',
              )
            : this.$translate.instant(
                'veeam_enterprise_infos_license_register_error',
              );

          return this.rejectResponse(response.data, message);
        });
    }

    // If action is "update"
    return this.veeamEnterprise
      .update(
        { serviceName },
        {
          ip,
          port,
          username,
          password,
        },
      )
      .$promise.then((response) =>
        this.acceptResponse(
          response,
          this.$translate.instant(
            'veeam_enterprise_infos_license_update_success',
          ),
        ),
      )
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant(
            'veeam_enterprise_infos_license_update_error',
          ),
        ),
      );
  }

  terminate(serviceName) {
    return this.veeamEnterprise
      .terminate({ serviceName })
      .$promise.then((response) =>
        this.acceptResponse(
          response,
          this.$translate.instant('veeam_enterprise_terminate_success'),
        ),
      )
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('veeam_enterprise_terminate_error'),
        ),
      );
  }

  acceptResponse(data, message) {
    return this.$q.resolve({
      status: 'OK',
      data,
      message,
    });
  }

  rejectResponse(data, message) {
    return this.$q.reject({
      status: 'ERROR',
      data,
      message,
    });
  }
}
