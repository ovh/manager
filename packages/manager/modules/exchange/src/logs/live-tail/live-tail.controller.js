import { GUIDE } from '../logs.constants';

export default class ExchangeLogsController {
  /* @ngInject */
  constructor(coreConfig) {
    this.logServiceGuideLink =
      GUIDE[coreConfig.getUser().ovhSubsidiary] ?? GUIDE.WE;
  }
}
