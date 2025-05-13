import angular from 'angular';

import { VOLUME_MIN_SIZE } from '../../../block.constants';
import {
  HOURS_PER_MONTH,
  LOCAL_ZONE_REGION,
  THREE_AZ_REGION,
  ONE_AZ_REGION,
} from '../../../../../project.constants';

export default class PciProjectStorageVolumeEditController {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    $q,
    ovhManagerRegionService,
    PciProjectStorageBlockService,
    PciProject,
    coreConfig,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$q = $q;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
    this.PciProject = PciProject;
    this.coreConfig = coreConfig;
    this.priceFormatter = new Intl.NumberFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: coreConfig.getUser().currency.code,
        maximumFractionDigits: 3,
      },
    );
    this.LOCAL_ZONE_REGION = LOCAL_ZONE_REGION;
    this.THREE_AZ_REGION = THREE_AZ_REGION;
    this.ONE_AZ_REGION = ONE_AZ_REGION;
  }

  $onInit() {
    this.size = {
      min: VOLUME_MIN_SIZE,
    };

    if (angular.isUndefined(this.sizeEditable)) {
      this.sizeEditable = false;
    }

    if (!this.sizeEditable) {
      this.size.min = this.storage.size;
      this.size.max = this.storage.size;
    }

    if (angular.isUndefined(this.displayBootable)) {
      this.displayBootable = false;
    }

    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');

    this.loading = true;
    this.are3azRegionsAvailable = false;
    this.regionType = null;
    return this.$q
      .all([
        this.$translate.refresh(),
        this.getAvailableQuota(),
        this.estimatePrice(),
        this.fetch3azAvailability(),
        this.fetchRegionType(),
      ])
      .finally(() => {
        this.loading = false;
      });
  }

  getAvailableQuota() {
    return this.PciProjectStorageBlockService.getAvailableQuota(
      this.projectId,
      this.storage,
    ).then((availableQuota) => {
      this.size.min = this.storage.size;
      if (this.sizeEditable) {
        this.size.max = availableQuota;
      }
    });
  }

  estimatePrice() {
    // Wait the next digest because oui-numeric use the viewValue whens calling on-change callback
    return this.$timeout(angular.noop, 0)
      .then(() =>
        this.PciProjectStorageBlockService.getVolumePriceEstimation(
          this.projectId,
          this.storage,
        ),
      )
      .then((estimatedPrice) => {
        this.estimatedPrice = this.priceFormatter.format(
          (estimatedPrice.price / 100000000) *
            HOURS_PER_MONTH *
            this.storage.size,
        );
      });
  }

  fetch3azAvailability() {
    return this.PciProjectStorageBlockService.get3azAvailability(
      this.projectId,
    ).then((are3azRegionsAvailable) => {
      this.are3azRegionsAvailable = are3azRegionsAvailable;
    });
  }

  fetchRegionType() {
    return this.PciProjectStorageBlockService.getProjectRegions(
      this.projectId,
    ).then((regions) => {
      this.regionType = regions.find(
        (r) => r.name === this.storage.region,
      )?.type;
    });
  }

  save() {
    return this.onSubmit(this.storage);
  }
}
