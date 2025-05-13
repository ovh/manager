import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

export default {
  template: `
      <div class="mb-3" data-ng-repeat="(country, zones) in $ctrl.groupedZones | orderHashByKey track by $index">
        <p data-ng-bind="country"></p>
        <oui-checkbox
          data-on-change="$ctrl.onSelectionChanged(zone, modelValue)"
          data-disabled="zone.selectable.value === false"
          data-description="{{ zone.selectable.reason }}"
          data-ng-repeat="zone in zones | orderBy: 'microRegion.text' track by $index">
          <span data-ng-bind="zone.microRegion.text"></span>
        </oui-checkbox>
      </div>`,
  controller: class {
    /* @ngInject */
    constructor($scope) {
      this.groupZones();
      this.selections = [];

      $scope.$watchCollection(
        () => this.zones,
        () => {
          this.groupZones();
        },
      );
    }

    onSelectionChanged(selectedZone, value) {
      let selection = find(
        this.selections,
        (item) => item.zone === selectedZone,
      );
      if (!selection) {
        selection = {
          zone: selectedZone,
          selected: false,
        };
        this.selections.push(selection);
      }
      selection.selected = value;

      this.onSelectionChange({
        value: map(
          filter(this.selections, (item) => item.selected),
          (item) => item.zone,
        ),
      });
    }

    groupZones() {
      this.groupedZones = groupBy(this.zones, (zone) => zone.country);
    }
  },
  bindings: {
    zones: '<',
    onSelectionChange: '&?',
  },
};
