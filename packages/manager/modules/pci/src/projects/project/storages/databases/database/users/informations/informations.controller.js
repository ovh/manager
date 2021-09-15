import { map } from 'lodash';

export default class usrInfomrationCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  $onInit() {
    this.isLoading = false;
    this.mapArrayForChip('keys');
    this.mapArrayForChip('categories');
    this.mapArrayForChip('channels');
    this.mapArrayForChip('commands');
  }

  mapArrayForChip(key) {
    this.user[key] = map(this.user[key], (a) => {
      return { title: a };
    });
  }
}
