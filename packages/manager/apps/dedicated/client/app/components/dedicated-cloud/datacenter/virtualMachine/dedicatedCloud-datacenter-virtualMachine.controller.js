import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor($q, DedicatedCloud, $translate) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
  }

  // Pagination useless (we have 2 sources)
  loadVirtualMachines() {
    return this.$q
      .all([
        this.DedicatedCloud.getDatacenterInfoVmLicensed(
          this.dedicatedCloud.serviceName,
          this.datacenterId,
        ),
        this.DedicatedCloud.getDatacenterInfoVm(
          this.dedicatedCloud.serviceName,
          this.datacenterId,
        ),
      ])
      .then(([licensedRes, infoRes]) => {
        const mergedArray = [
          ...new Map(
            [...infoRes.data, ...licensedRes.data].map((item) => [
              item.vmId,
              {
                ...pick(item, ['vmId', 'license', 'name', 'guestOsFamily']),
                allowEditLicense: item.guestOsFamily
                  ?.toLowerCase()
                  .includes('windows'),
              },
            ]),
          ).values(),
        ];

        return {
          data: mergedArray,
          meta: {
            totalCount: mergedArray.length,
          },
        };
      })
      .catch((err) => {
        this.setMessage(
          `${this.$translate.instant(
            'virtualmachine_error_loading',
          )} ${err.message || ''}`,
          'danger',
        );
        return this.$q.reject(err);
      });
  }
}
