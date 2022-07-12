import angular from 'angular';

import {
  CUSTOM_SNAPSHOT_NAME_PREFIX,
  CUSTOM_SNAPSHOT_NAME_SEPARATOR,
  TRANSLATE_PREFIX,
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
    this.snapshots = {
      customs: this.customSnapshots,
      types: this.snapshotEnum.map(({ label, value }) => ({
        enabled: this.snapshotTypes.includes(value),
        label,
        value,
      })),
    };

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
    this.model.customSnapshotName = null;
  }

  resetSnapshotTypes() {
    this.model.snapshotTypes = angular.copy(this.snapshots.types);
  }

  updateSnapshotTypes() {
    const promises = [];

    this.isUpdatingSnapshotTypes = true;

    this.snapshots.types.forEach((oldType) => {
      const newType = this.model.snapshotTypes.find(
        ({ value }) => oldType.value === value,
      );

      if (!oldType.enabled && newType.enabled) {
        promises.push(
          this.$http.post(`${this.partitionApiUrl}/snapshot`, {
            snapshotType: newType.value,
          }),
        );
      }

      if (oldType.enabled && !newType.enabled) {
        promises.push(
          this.$http.delete(
            `${this.partitionApiUrl}/snapshot/${newType.value}`,
          ),
        );
      }
    });

    this.$q
      .all(promises)
      .then((responses) =>
        this.trackTasks({
          tasks: responses.map(({ data: task }) => task),
          partitionName: this.partition.partitionName,
        }),
      )
      .catch((error) => {
        this.isUpdatingSnapshotTypes = false;
        this.alertError(error);
      });
  }

  createCustomSnapshot() {
    const { partitionName } = this.partition;
    const name = [
      this.customSnapshotNamePrefix,
      this.model.customSnapshotName,
    ].join(this.customSnapshotNameSeparator);

    this.isCreatingCustomSnapshot = true;

    this.$http
      .post(`${this.partitionApiUrl}/customSnapshot`, { name })
      .then(({ data: task }) =>
        this.trackTasks({
          tasks: [task],
          customSnapshotName: name,
          partitionName,
        }),
      )
      .catch((error) => {
        this.isCreatingCustomSnapshot = false;
        this.alertError(error);
      });
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE_PREFIX}_${key}`, values);
  }
}
