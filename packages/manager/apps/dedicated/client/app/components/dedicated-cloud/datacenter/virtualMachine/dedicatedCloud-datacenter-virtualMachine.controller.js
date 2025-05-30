import { VIRTUAL_MACHINES_ID, VIRTUAL_MACHINES_VCPU } from './constants';

export default class {
  /* @ngInject */
  constructor($q, DedicatedCloud, $translate) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
    this.virtualMachinesId = VIRTUAL_MACHINES_ID;
    this.virtualMachinesVcpu = VIRTUAL_MACHINES_VCPU;
  }

  loadVirtualMachines(config) {
    const { offset, pageSize, sort, criteria } = config;
    return this.DedicatedCloud.getDatacenterInfoVm(
      this.dedicatedCloud.serviceName,
      this.datacenterId,
      {
        offset,
        pageSize,
        sort: sort.property,
        sortOrder: sort.dir === 1 ? 'ASC' : 'DESC',
        filters: criteria.map((cr) => {
          return {
            field: cr.property || 'name',
            comparator: cr.operator,
            reference: [cr.value],
          };
        }),
      },
    )
      .then((res) => {
        const data = res.data.map((item) => ({
          ...item,
          allowEditLicense: item.guestOsFamily
            ?.toLowerCase()
            .includes('windows'),
          guestOs: item.guestOsFamily
            ?.replace(/(_?\d+)?Guest$/, '')
            ?.replace(/([a-zA-Z])(\d+)/g, '$1 $2')
            ?.replace(/(\d+)([a-zA-Z])/g, '$1 $2'),
          backupState: item.backup?.state,
          disksSize: item.filers?.reduce(
            (total, filer) =>
              total + filer.disks.reduce((sum, disk) => sum + disk.capacity, 0),
            0,
          ),
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
