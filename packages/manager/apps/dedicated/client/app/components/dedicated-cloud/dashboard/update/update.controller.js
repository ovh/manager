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
    this.hasSufficientRights =
      this.currentUser.nichandle ===
        this.currentService.serviceInfos.contactAdmin ||
      this.currentUser.nichandle ===
        this.currentService.serviceInfos.contactTech;
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
      name: `${this.trackingPrefix}::dashboard::update::schedule-update`,
      type: 'action',
    });

    this.isUpdating = true;
    return this.DedicatedCloud.updateSoftware(
      this.currentService.serviceName,
      this.currentService.version.major === this.targetVersion.major
        ? UPDATE_TYPES.MINOR
        : UPDATE_TYPES.MAJOR,
    )
      .then(() => {
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
