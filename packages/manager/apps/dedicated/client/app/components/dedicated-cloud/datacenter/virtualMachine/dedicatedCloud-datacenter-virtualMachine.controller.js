import pick from 'lodash/pick';
import { VIRTUAL_MACHINES_GUEST_OS, VIRTUAL_MACHINES_TITLE } from './constants';

export default class {
  /* @ngInject */
  constructor($q, DedicatedCloud, $translate) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
    this.virtualMachinesTitle = VIRTUAL_MACHINES_TITLE;
    this.virtualMachinesGuesOS = VIRTUAL_MACHINES_GUEST_OS;
  }

  loadVirtualMachines({ offset, pageSize, sort }) {
    return this.DedicatedCloud.getDatacenterInfoVm(
      this.dedicatedCloud.serviceName,
      this.datacenterId,
      {
        offset,
        pageSize,
        sort: sort.property,
        sortOrder: sort.dir === 1 ? 'ASC' : 'DESC',
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
