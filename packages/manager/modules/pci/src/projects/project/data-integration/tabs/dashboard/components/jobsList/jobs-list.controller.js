import { JOB_STATUSES } from './jobs-list.constants';

export default class DataIntegrationJobsListCtrl {
  constructor() {
    this.getElapsed = DataIntegrationJobsListCtrl.getElapsed;
  }

  $onInit() {
    this.JOB_STATUSES = JOB_STATUSES;
  }

  static getElapsed(ms) {
    if (!ms) {
      return '-';
    }
    // convert to seconds
    let diff = ms / 1000;
    const seconds = Math.round(diff % 60);
    diff = Math.floor(diff / 60);
    const minutes = Math.round(diff % 60);
    diff = Math.floor(diff / 60);
    const hours = diff;
    return [hours, minutes, seconds]
      .map((unit) => unit.toString().padStart(2, '0'))
      .join(':');
  }
}
