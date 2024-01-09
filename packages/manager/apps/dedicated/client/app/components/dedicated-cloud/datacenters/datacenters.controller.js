import includes from 'lodash/includes';
import {
  REGEX_LEGACY_DATACENTER,
  REGEX_EXCLUDE_LEGACY_DATACENTER,
  MIGRATION_GUIDE,
  EDGES_SIZES,
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

  loadDataCenterDetails(id) {
    return this.DedicatedCloud.getDatacenterInfoNsxt(
      this.dedicatedCloud.serviceName,
      id,
    ).then(({ data }) => ({
      edgesCount: data.length,
      clusterSize: data[0]?.size ? EDGES_SIZES[data[0].size] : '',
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
