import {
  COMMANDS, COMMANDS_LIST, PARAMETERS,
} from './flags.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.COMMANDS_LIST = COMMANDS_LIST;
    this.PARAMETERS = PARAMETERS;
  }

  $onInit() {
    this.connectionString = `${COMMANDS[this.clusterType][this.command]} -U ${this.PARAMETERS.USERNAME} -h ${this.endPoint.fqdn} -p ${this.endPoint.port} -d ${this.PARAMETERS.DATABASE} -W --set=sslmode=${this.PARAMETERS.SSL_MODE}`;
    this.restoreString = `${COMMANDS[this.clusterType][this.command]} -U ${this.PARAMETERS.USERNAME} -h ${this.endPoint.fqdn} -p ${this.endPoint.port} -d <db-name> -W <local-dump-path>`;
  }
}
