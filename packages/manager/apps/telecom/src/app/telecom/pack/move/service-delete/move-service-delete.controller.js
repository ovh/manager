import chunk from 'lodash/chunk';
import every from 'lodash/every';
import filter from 'lodash/filter';
import map from 'lodash/map';
import set from 'lodash/set';

export default class MoveServiceDeleteCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.subServicesToDelete.forEach((subService) => {
      set(
        subService,
        'services',
        map(subService.services, (service, index, originalArray) => ({
          name: service,
          selected: originalArray.length === subService.numberToDelete,
        })),
      );
    });

    this.chunkedSubServices = chunk(this.subServicesToDelete, 2);
  }

  // eslint-disable-next-line class-methods-use-this
  selectedSubServiceToDeleteReached(subService) {
    const count = filter(subService.services, {
      selected: true,
    }).length;

    return count === subService.numberToDelete;
  }

  isValidSelection() {
    return every(this.subServicesToDelete, (subService) =>
      this.selectedSubServiceToDeleteReached(subService),
    );
  }

  next() {
    this.$scope.$emit('subservicesDelete', this.subServicesToDelete);
  }
}
