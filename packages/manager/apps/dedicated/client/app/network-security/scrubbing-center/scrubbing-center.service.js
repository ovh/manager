import { API_PATH } from './scrubbing-center.constant';

export default class ScrubbingCenterService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
    this.API_PATH = API_PATH;
  }

  getEvents(params) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2${this.API_PATH}/event`,
      params,
    });
  }
}
