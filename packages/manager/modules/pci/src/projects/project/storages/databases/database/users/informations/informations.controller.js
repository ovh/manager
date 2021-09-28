import { map } from 'lodash';
import { USER_INFORMATIONS_LISTS } from './informations.constant';

export default class usrInfomrationCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  $onInit() {
    this.isLoading = false;
    USER_INFORMATIONS_LISTS.forEach((element) => {
      this.mapArrayForChip(element);
    });
  }

  mapArrayForChip(key) {
    this.user[key] = map(this.user[key], (a) => {
      return { title: a };
    });
  }
}
