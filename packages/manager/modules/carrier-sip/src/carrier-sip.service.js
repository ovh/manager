import map from 'lodash/map';

import VoipCarrierSipLine from './VoipCarrierSipLine.class';

export default class CarrierSipService {
  /* @ngInject */
  constructor($q, OvhApiTelephony) {
    this.$q = $q;
    this.OvhApiTelephony = OvhApiTelephony;
  }

  fetchAll(billingAccount) {
    return this.OvhApiTelephony.CarrierSip()
      .Iceberg()
      .query()
      .expand('CachedObjectList-Cursor')
      .execute({ billingAccount })
      .$promise.then(({ data: carrierSipLines }) =>
        map(
          carrierSipLines,
          (carrierSipLine) =>
            new VoipCarrierSipLine({
              billingAccount,
              ...carrierSipLine,
            }),
        ),
      );
  }

  getCarrierSip(billingAccount, serviceName) {
    return this.OvhApiTelephony.CarrierSip()
      .v6()
      .get({
        billingAccount,
        serviceName,
      })
      .$promise.then(
        (carrierSip) =>
          new VoipCarrierSipLine({
            ...carrierSip,
            billingAccount,
          }),
      );
  }

  getSettings(billingAccount, serviceName) {
    return this.OvhApiTelephony.CarrierSip().Settings().v6().query({
      billingAccount,
      serviceName,
    }).$promise;
  }

  getServiceInfos(serviceName) {
    return this.OvhApiTelephony.Lines().v6().getServiceInfos({
      serviceName,
    }).$promise;
  }

  getEndpoints(billingAccount, serviceName) {
    return this.OvhApiTelephony.CarrierSip()
      .Endpoints()
      .v6()
      .query({
        billingAccount,
        serviceName,
      })
      .$promise.then((endpointsIds) =>
        this.$q.all(
          map(
            endpointsIds,
            (endpointId) =>
              this.OvhApiTelephony.CarrierSip().Endpoints().v6().get({
                billingAccount,
                serviceName,
                id: endpointId,
              }).$promise,
          ),
        ),
      );
  }
}
