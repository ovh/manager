import find from 'lodash/find';
import map from 'lodash/map';

import { ENDPOINT_TYPES } from './connection-details.constants';
import { COMMANDS_LIST, PARAMETERS } from './flags/flags.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.COMMANDS_LIST = COMMANDS_LIST;
    this.PARAMETERS = PARAMETERS;
  }

  $onInit() {
    this.readWriteEndpoint = find(this.endPoints, {
      name: ENDPOINT_TYPES.READ_WRITE,
    });
    this.connectionStrings = map(this.endPoints, (endpoint) => ({
      name: endpoint.name,
      text: `${this.clusterType}://${this.PARAMETERS.USERNAME}:${this.PARAMETERS.MASKED_PASSWORD}@${endpoint.fqdn}:${endpoint.port}/${this.PARAMETERS.DATABASE}?sslmode=${this.PARAMETERS.SSL_MODE}`,
    }));
  }
}
