import NashaDashboardController from '../dashboard.controller';
import { STATE_NAME } from './partition.constants';

export default class NashaDashboardPartitionController extends NashaDashboardController {
  /* @ngInject */
  constructor(NashaTask) {
    super();
    this.operations = [NashaTask.operation.Update];
    this.stateName = STATE_NAME;
  }
}
