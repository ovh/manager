import get from 'lodash/get';

import { UPDATE_TYPES } from './update.constant';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, DedicatedCloud, OvhApiMe) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.DedicatedCloud = DedicatedCloud;
    this.OvhApiMe = OvhApiMe;
  }

  $onInit() {
    this.loadingUserInfo = true;
    return this.OvhApiMe.v6()
      .get()
      .$promise.then(({ nichandle }) => {
        this.hasSufficientRights =
          nichandle === this.currentService.serviceInfos.contactAdmin ||
          nichandle === this.currentService.serviceInfos.contactTech;
      })
      .catch(() => {
        this.hasSufficientRights = true;
      })
      .finally(() => {
        this.loadingUserInfo = false;
      });
  }

  getDisplayName(softwareVersion) {
    const solution = {
      displayName: this.$translate.instant(
        `dedicatedCloud_dashboard_update_software_${this.currentService.solution.toUpperCase()}`,
      ),
      displayVersionNumber: get(softwareVersion, 'major', ''),
      displayBuildNumber: get(softwareVersion, 'build', ''),
    };

    return `${solution.displayName} ${solution.displayVersionNumber} (build ${solution.displayBuildNumber})`.trim();
  }

  update() {
    this.atInternet.trackClick({
      name: 'update::schedule-update',
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'dedicatedClouds',
      chapter3: 'dashboard',
    });

    this.isUpdating = true;
    return this.DedicatedCloud.updateSoftware(
      this.currentService.serviceName,
      this.currentService.version.major === this.targetVersion.major
        ? UPDATE_TYPES.MINOR
        : UPDATE_TYPES.MAJOR,
    )
      .then((task) => {
        this.currentService.vcenterUpgradePendingTask = task;
        this.goBack(
          this.$translate.instant('dedicatedCloud_dashboard_update_success', {
            sourceMajor: this.currentService.version.major,
            sourceBuild: this.currentService.version.build,
            targetMajor: this.targetVersion.major,
            targetBuild: this.targetVersion.build,
            operationsLink: this.operationsUrl,
          }),
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('dedicatedCloud_dashboard_update_error', {
            message: get(error, 'message'),
          }),
          'danger',
        ),
      );
  }
}
