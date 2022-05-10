import angular from 'angular';

import {
  CUSTOM_SNAPSHOT_NAME_PREFIX,
  CUSTOM_SNAPSHOT_NAME_SEPARATOR,
  TRANSLATE,
} from './snapshots.constants';

export default class NashaDashboardPartitionSnapshotsController {
  /* @ngInject */
  constructor($q, $http, $translate) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;

    this.isCreatingCustomSnapshot = false;
    this.isCustomSnapshotFormShown = false;
    this.isUpdatingSnapshotTypes = false;

    this.model = {
      customSnapshotName: '',
      snapshotTypes: [],
    };

    this.customSnapshotNamePrefix = CUSTOM_SNAPSHOT_NAME_PREFIX;
    this.customSnapshotNameSeparator = CUSTOM_SNAPSHOT_NAME_SEPARATOR;
  }

  $onInit() {
    // Break references to the snapshots resolve
    this.snapshots = angular.copy(this.snapshots);

    this.snapshots.types.forEach((snapshotType) => {
      Object.assign(snapshotType, {
        hasTasks: snapshotType.tasks.update?.length > 0,
      });
    });

    this.snapshots.customs.forEach((customSnapshot) => {
      Object.assign(customSnapshot, {
        hasTasks:
          customSnapshot.tasks.create?.length > 0 ||
          customSnapshot.tasks.delete?.length > 0,
      });
    });

    this.resetSnapshotTypes();
  }

  get canUpdateSnapshotTypes() {
    if (this.isUpdatingSnapshotTypes) {
      return false;
    }

    const newSnapshotTypes = this.model.snapshotTypes
      .map(({ enabled }) => enabled)
      .join('');

    const oldSnapshotTypes = this.snapshots.types
      .map(({ enabled }) => enabled)
      .join('');

    return newSnapshotTypes !== oldSnapshotTypes;
  }

  get canCreateCustomSnapshot() {
    return this.customSnapshotForm
      ? this.customSnapshotForm.$valid && !this.isCreatingCustomSnapshot
      : false;
  }

  get readableSnapshotTypesModel() {
    const frequencies = this.model.snapshotTypes
      .filter(({ enabled }) => enabled)
      .map(({ label }) => label)
      .join(', ');

    return frequencies || this.translate('frequencies_placeholder');
  }

  showCustomSnapshotForm() {
    this.isCustomSnapshotFormShown = true;
    this.model.customSnapshotName = [
      this.partition.partitionName,
      new Date().toISOString(),
    ].join(this.customSnapshotNameSeparator);
  }

  hideCustomSnapshotForm() {
    this.isCustomSnapshotFormShown = false;
    this.model.customSnapshotName = undefined;
  }

  resetSnapshotTypes() {
    this.model.snapshotTypes = angular.copy(this.snapshots.types);
  }

  updateSnapshotTypes() {
    const promises = [];

    this.isUpdatingSnapshotTypes = true;

    this.snapshots.types.forEach((oldType) => {
      const newType = this.model.snapshotTypes.find(
        ({ type }) => oldType.type === type,
      );

      if (!oldType.enabled && newType.enabled) {
        promises.push(
          this.$http.post(`${this.partitionApiUrl}/snapshot`, {
            snapshotType: newType.type,
          }),
        );
      }

      if (oldType.enabled && !newType.enabled) {
        promises.push(
          this.$http.delete(`${this.partitionApiUrl}/snapshot/${newType.type}`),
        );
      }
    });

    this.$q
      .all(promises)
      .then(() =>
        this.reload({ success: this.translate('snapshot_types_updated') }),
      )
      .catch((error) => {
        this.alertError(error);
        this.isUpdatingSnapshotTypes = false;
      });
  }

  createCustomSnapshot() {
    const name = [
      this.customSnapshotNamePrefix,
      this.model.customSnapshotName,
    ].join(this.customSnapshotNameSeparator);

    this.isCreatingCustomSnapshot = true;

    this.$http
      .post(`${this.partitionApiUrl}/customSnapshot`, { name })
      .then(() =>
        this.reload({ success: this.translate('custom_snapshot_created') }),
      )
      .catch((error) => {
        this.alertError(error);
        this.isCreatingCustomSnapshot = false;
      });
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE}_${key}`, values);
  }
}
