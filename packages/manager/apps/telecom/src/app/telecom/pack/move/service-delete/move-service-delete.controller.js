import chunk from 'lodash/chunk';
import map from 'lodash/map';
import set from 'lodash/set';

export default class MoveServiceDeleteCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.subServicesToDelete.forEach((subService) => {
      set(subService, 'numberServices', subService.numberToDelete);
      set(
        subService,
        'services',
        map(subService.services, (service) => ({
          name: service.service,
          isAllowed: service.isAllowed,
          renewPeriod: service.renewPeriod,
          renewPrice: service.renewPrice,
          price: service.price,
          selected: false,
        })),
      );
    });

    this.chunkedSubServices = chunk(this.subServicesToDelete, 2);
  }

  static selectSubServices(modelValue, subService) {
    subService.services.forEach((service) => {
      if (service.isAllowed) {
        set(service, 'selected', modelValue);
      }
    });
  }

  static hasKeepableSubServices(subService) {
    return subService.services.some((service) => service.isAllowed);
  }

  next() {
    this.$scope.$emit('subservicesDelete', this.subServicesToDelete);
  }
}
