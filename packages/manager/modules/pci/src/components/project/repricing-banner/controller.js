import moment from 'moment';
import { REPRICING_LINKS_INFO } from './constants';

const REPRICING_DATE_EFFECT = moment('2022-10-01');

export default class ProjectRepricingBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
  }

  $onInit() {
    this.isCustomerConcernedByRepricingBanner =
      this.projects.find(({ creationDate }) =>
        moment(creationDate).isAfter(REPRICING_DATE_EFFECT),
      ) !== undefined;

    this.repricingLinkDetails =
      REPRICING_LINKS_INFO[this.ovhSubsidiary] || REPRICING_LINKS_INFO.DEFAULT;
  }
}
