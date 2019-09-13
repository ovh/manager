angular.module('managerApp')
  .component('iplbZonePicker', {
    template: `
      <div data-ng-repeat="(country, zones) in $ctrl.groupedZones | orderHashByKey track by $index">
        <p data-ng-bind="country"></p>
        <oui-checkbox
          data-on-change="$ctrl.onSelectionChanged(zone, modelValue)"
          data-disabled="zone.selectable.value === false"
          data-description="{{ zone.selectable.reason }}"
          data-ng-repeat="zone in zones | orderBy: 'microRegion.text' track by $index"
          data-text="{{ zone.microRegion.text }}"></oui-checkbox>
      </div>`,
    controller:
      class {
        constructor($scope) {
          this.groupZones();
          this.selections = [];

          $scope.$watchCollection(() => this.zones, () => {
            this.groupZones();
          });
        }

        onSelectionChanged(selectedZone, value) {
          let selection = _.find(this.selections, item => item.zone === selectedZone);
          if (!selection) {
            selection = {
              zone: selectedZone,
              selected: false,
            };
            this.selections.push(selection);
          }
          selection.selected = value;

          this.onSelectionChange({
            value: _.map(_.filter(this.selections, item => item.selected), item => item.zone),
          });
        }

        groupZones() {
          this.groupedZones = _.groupBy(this.zones, zone => zone.country);
        }
      },
    bindings: {
      zones: '<',
      onSelectionChange: '&?',
    },
  });
