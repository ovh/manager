import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor($q, DedicatedCloud, $translate) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
  }

  loadVirtualMachines({ offset, pageSize }) {
    return this.DedicatedCloud.getDatacenterInfoVm(
      this.dedicatedCloud.serviceName,
      this.datacenterId,
      {
        offset,
        pageSize,
      },
    )
      .then((res) => {
        const data = res.data.map((item) => ({
          ...pick(item, ['vmId', 'license', 'name', 'guestOsFamily']),
          allowEditLicense: item.guestOsFamily
            ?.toLowerCase()
            .includes('windows'),
        }));

        return {
          data,
          meta: res.meta,
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
