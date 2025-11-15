import includes from 'lodash/includes';
import {
  REGEX_LEGACY_DATACENTER,
  REGEX_EXCLUDE_LEGACY_DATACENTER,
  MIGRATION_GUIDE,
} from './datacenter.constants';

export default class {
  /* @ngInject */
  constructor($q, DedicatedCloud, coreConfig) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.hasNsxDatacenter = false;
    this.migrationGuideUrl =
      MIGRATION_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      MIGRATION_GUIDE.DEFAULT;
  }

  canOrderDatacenter() {
    return this.dedicatedCloud.canOrderDatacenter && this.addVdcAvailable;
  }

  getRight(order) {
    return this.dedicatedCloud
      ? !includes(this.dedicatedCloud.orderRight, order)
      : false;
  }

  onAddDatacenterClick() {
    this.trackClick('datacenter::add');
    return this.addDatacenter();
  }

  loadDatacenterVmStats(row) {
    return this.DedicatedCloud.getDatacenterInfoVm(
      this.dedicatedCloud.serviceName,
      row.id,
    )
      .then((res) => {
        const vms = res?.data || [];
        const totalCount = res?.meta?.totalCount || vms.length;

        const windowsCount = vms.filter((vm) =>
          vm.guestOsFamily?.toLowerCase().startsWith('windows'),
        ).length;

        const licensedCount = vms.filter((vm) => !!vm.license).length;

        return {
          vm: {
            loading: false,
            error: false,
            value: totalCount,
          },
          windows: {
            loading: false,
            error: false,
            value: windowsCount,
          },
          licensed: {
            loading: false,
            error: false,
            value: licensedCount,
          },
        };
      })
      .catch(() => ({
        vm: { loading: false, error: true, value: null },
        windows: { loading: false, error: true, value: null },
        licensed: { loading: false, error: true, value: null },
      }));
  }

  loadDatacenters({ offset, pageSize }) {
    return this.DedicatedCloud.getDatacentersInformations(
      this.dedicatedCloud.serviceName,
      pageSize,
      offset - 1,
    )
      .then((result) => {
        const data = result.list?.results;

        this.hasLegacyDatacenter =
          !!data.find((datacenter) => {
            return REGEX_LEGACY_DATACENTER.test(datacenter.commercialName);
          }) &&
          !data.find((datacenter) => {
            return REGEX_EXCLUDE_LEGACY_DATACENTER.test(
              datacenter.commercialName,
            );
          });

        data.forEach((row) => {
          Object.assign(row, {
            vm: { loading: true },
            licensed: { loading: true },
            windows: { loading: true },
          });
          this.loadDatacenterVmStats(row).then((res) =>
            Object.assign(row, res),
          );
        });

        return {
          data,
          meta: {
            totalCount: result.count,
          },
        };
      })
      .catch((err) => {
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_loading_error',
          )} ${err.message || ''}`,
          'danger',
        );
        return this.$q.reject(err);
      });
  }
}
