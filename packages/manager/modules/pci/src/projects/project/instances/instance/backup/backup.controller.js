import get from 'lodash/get';

import { FLAVORS_TYPE, HOURS_PER_MONTH } from './backup.contants';
import {
  LOCAL_ZONE_REGION,
  ONE_AZ_REGION,
  THREE_AZ_REGION,
} from '../../../project.constants';

export default class PciInstanceBackupController {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    $scope,
    $q,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
    OvhApiCloudProjectRegion,
    ovhManagerRegionService,
    atInternet,
    coreConfig,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.$scope = $scope;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
    this.FLAVORS_TYPE = FLAVORS_TYPE;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.backup = {
      name: `${this.instance.name} ${this.$filter('date')(
        new Date(),
        'short',
      )}`,
      distantRegion: null,
      distantSnapshotName: `${this.instance.name} ${this.$filter('date')(
        new Date(),
        'short',
      )}`,
    };
    this.distantSnapshot = false;

    this.isLoading = true;
    this.$q
      .all([
        this.PciProjectsProjectInstanceService.getDistantBackupAvailableRegions(
          this.projectId,
          this.instance.region,
        ).then((regions) => {
          this.distantBackupRegions = regions
            .map((r) => {
              let badgeClass = '';
              let badgeName = '';

              if (r.type === THREE_AZ_REGION) {
                badgeClass = 'oui-3az';
                badgeName = 'pci_project_flavors_zone_3az_region';
              } else if (r.type === ONE_AZ_REGION) {
                badgeClass = 'oui-1az';
                badgeName = 'pci_project_flavors_zone_global_region';
              } else if (r.type === LOCAL_ZONE_REGION) {
                badgeClass = 'oui-localzone';
                badgeName = 'pci_project_flavors_zone_localzone';
              }

              return {
                ...r,
                badgeClass,
                badgeName,
              };
            })
            .sort((a, b) =>
              a.microRegion.text.localeCompare(b.microRegion.text),
            );
        }),
      ])
      .then(() => {
        this.isLoading = false;
      });

    const updateShowActivateRegionWarning = () => {
      this.showActivateRegionWarning =
        this.distantSnapshot &&
        this.shouldEnableRegion(this.backup.distantRegion);
    };

    this.$scope.$watch(
      '$ctrl.backup.distantRegion',
      updateShowActivateRegionWarning,
    );
    this.$scope.$watch(
      '$ctrl.distantSnapshot',
      updateShowActivateRegionWarning,
    );
  }

  createBackup() {
    this.isLoading = true;
    this.trackBackupCreate();

    const backupToCreate = {
      ...this.backup,
    };
    if (!this.distantSnapshot) {
      delete backupToCreate.distantSnapshotName;
      delete backupToCreate.distantRegion;
    }

    return (this.shouldEnableRegion(backupToCreate.distantRegion)
      ? this.OvhApiCloudProjectRegion.v6()
          .addRegion(
            { serviceName: this.projectId },
            { region: backupToCreate.distantRegion },
          )
          .$promise.then(() => {
            return this.$q.all([
              this.OvhApiCloudProjectRegion.AvailableRegions()
                .v6()
                .resetQueryCache(),
              this.PciProjectsProjectInstanceService.getSnapshotAvailability(
                this.projectId,
                this.catalogEndpoint,
              ).then((snapshotAvailability) => {
                this.snapshotAvailability[backupToCreate.distantRegion] =
                  snapshotAvailability[backupToCreate.distantRegion];
              }),
            ]);
          })
      : Promise.resolve()
    )
      .then(() => {
        return this.PciProjectsProjectInstanceService.createBackup(
          this.projectId,
          this.instance,
          backupToCreate,
        );
      })
      .then(() =>
        this.goBack(
          this.$translate.instant(
            backupToCreate.distantRegion
              ? 'pci_projects_project_instances_instance_backup_with_distant_success_message'
              : 'pci_projects_project_instances_instance_backup_success_message',
            {
              backup: backupToCreate.name,
              distantName: backupToCreate.distantSnapshotName,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_backup_error_backup',
            {
              message: get(err, 'data.message', null),
              backup: backupToCreate.name,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  trackBackupCreate() {
    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::instances::backup::confirm',
      type: 'action',
    });
  }

  formatPrice() {
    const { price } = this.snapshotAvailability[this.instance.region].plans[0];

    const { value, currencyCode } = price;
    return `~${new Intl.NumberFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 3,
      },
    ).format(value * HOURS_PER_MONTH)}`;
  }

  getRegionGroup(region) {
    return region.continent;
  }

  shouldEnableRegion(regionName) {
    if (!regionName) return false;

    const region = this.distantBackupRegions.find((r) => r.name === regionName);

    return !!region && !region.enabled;
  }
}
