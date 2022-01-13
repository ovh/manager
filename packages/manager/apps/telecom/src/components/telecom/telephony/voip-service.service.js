import forEach from 'lodash/forEach';
import has from 'lodash/has';

export default /* @ngInject */ function TelephonyVoipService(
  OvhApiTelephony,
  TelephonyGroup,
  TelephonyGroupLine,
  TelephonyGroupNumber,
  TelephonyGroupFax,
  iceberg,
) {
  const self = this;

  /*
   * Fetch all telephony services and billing account using API V7
   */
  self.fetchAll = function fetchAll() {
    const groups = {}; // indexed by billing accounts
    // fetch all billing accounts

    return iceberg('/telephony')
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data: result }) => {
        forEach(result, (item) => {
          if (item && item.billingAccount) {
            // how should we handle errors ?
            const telephonyGroup = new TelephonyGroup(item);
            groups[telephonyGroup.billingAccount] = telephonyGroup;
          }
        });
        // fetch all services
        return OvhApiTelephony.Service()
          .v7()
          .query()
          .aggregate('billingAccount')
          .expand()
          .execute()
          .$promise.then((aggregateResult) => {
            // associate and create service to billing account
            forEach(aggregateResult, (item) => {
              // extract billing account from path
              const pathParts = item.path.split('/');
              if (pathParts.length >= 2) {
                const billingAccount = pathParts[2].toLowerCase();
                if (groups[billingAccount] === undefined) {
                  return;
                }
                const service = item.value;
                service.billingAccount = billingAccount;
                if (has(item, 'value.serviceName')) {
                  // create the service
                  if (['fax', 'voicefax'].includes(service.featureType)) {
                    const fax = new TelephonyGroupFax(service);
                    groups[billingAccount].fax.push(fax);
                  } else if (has(groups, billingAccount)) {
                    const line = new TelephonyGroupLine(service);
                    const number = new TelephonyGroupNumber(service);
                    switch (service.serviceType) {
                      case 'line':
                        groups[billingAccount].lines.push(line);
                        break;
                      case 'alias':
                        groups[billingAccount].numbers.push(number);
                        break;
                      default:
                        break;
                    }
                  }
                }
              }
            });
            return groups;
          });
      });
  };
}
