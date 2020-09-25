import { ELIGIBILITY_LINE_STATUS } from '../pack-move.constant';

export default class MoveEligibilityCtrl {
  /* @ngInject */
  constructor($scope, $translate) {
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    this.displayEligibility = false;
    this.minDate = moment()
      .add(1, 'day')
      .format('YYYY-MM-DD');
    this.maxDate = moment()
      .add(30, 'day')
      .format('YYYY-MM-DD');
  }

  /**
   * Compute the offers
   * @param offers
   */
  computeOffer(offers) {
    if (offers) {
      this.displayEligibility = true;
      this.lines = offers;
    }
  }

  getTitle(status) {
    let label = '';
    switch (status) {
      case ELIGIBILITY_LINE_STATUS.active:
        label = 'pack_move_eligibility_line_status_active';
        break;
      case ELIGIBILITY_LINE_STATUS.inactive:
        label = 'pack_move_eligibility_line_status_inactive';
        break;
      case ELIGIBILITY_LINE_STATUS.create:
        label = 'pack_move_eligibility_line_status_create';
        break;
      default:
        label = 'pack_move_eligibility_line_unknown_status';
        break;
    }
    return this.$translate.instant(label);
  }

  chooseLine(line) {
    const selected = {
      line,
      moveOutDate: this.moveOutDate,
    };
    this.$scope.$emit('eligibleSelectedLine', selected);
  }
}
