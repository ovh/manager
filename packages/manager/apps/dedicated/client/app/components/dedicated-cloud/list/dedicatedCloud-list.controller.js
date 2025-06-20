import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    DedicatedCloud,
    Alerter,
    ouiDatagridService,
    constants,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.Alerter = Alerter;
    this.locationInfo = {};
    this.constants = constants;
  }

  $onInit() {
    super.$onInit();
  }

  loadResource($row) {
    if (this.locationInfo[$row.location]) {
      return this.$q.when(this.buildRow($row));
    }

    return this.DedicatedCloud.getLocation($row.serviceName)
      .then((locationInfo) => {
        this.locationInfo[$row.location] = locationInfo;
        return this.buildRow($row);
      })
      .catch((error) => {
        const errorMessage = error.data?.message || error.data;
        if (errorMessage === 'This service is expired') {
          return this.buildRow($row);
        }
        this.Alerter.error(
          [
            this.$translate.instant('dedicatedCloud_list_loadLocation_error'),
            errorMessage ? `(${errorMessage})` : '',
          ].join(' '),
          'dedicatedCloud',
        );
        return this.buildRow($row);
      });
  }

  buildRow($row) {
    return {
      ...$row,
      regionLocation: this.buildLocationInfo($row, 'regionLocation'),
      region: this.buildLocationInfo($row, 'region'),
      countryCode: this.buildLocationInfo($row, 'countryCode'),
      softwareSolution: this.buildSoftwareSolution($row),
    };
  }

  buildLocationInfo($row, field) {
    if (
      this.locationInfo[$row.location] &&
      this.locationInfo[$row.location][field]
    ) {
      return this.locationInfo[$row.location][field];
    }
    return null;
  }

  buildSoftwareSolution($row) {
    const solution = {
      displayName: this.$translate.instant(
        `dedicatedCloud_list_softwareSolution_definition_displayName_${$row.managementInterface.toUpperCase()}`,
      ),
      displayMajorVersionNumber:
        $row.version && $row.version.major ? $row.version.major : '',
      displayMinorVersionNumber:
        $row.version && $row.version.minor ? $row.version.minor : '',
    };

    return `${solution.displayName} ${solution.displayMajorVersionNumber} ${solution.displayMinorVersionNumber}`.trim();
  }
}
