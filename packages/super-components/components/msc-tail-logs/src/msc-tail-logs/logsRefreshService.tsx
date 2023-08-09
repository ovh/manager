/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { fetchLogs } from './logsService';
import { LogEntry, SortOrder } from './tailLogsTypes';

export class LogsRefreshService {
  private logsRefreshInterval: any = null;

  constructor(
    private source: string,
    private sort: SortOrder,
    private logLimit: number,
    private refreshInterval: number,
    private onUpdateLogs: (logs: LogEntry[]) => void,
  ) {}

  async startLogsRefreshInterval() {
    await this.fetchLogs();
    this.logsRefreshInterval = setInterval(async () => {
      await this.fetchLogs();
    }, this.refreshInterval);
  }

  stopLogsRefreshInterval() {
    clearInterval(this.logsRefreshInterval);
    this.logsRefreshInterval = null;
  }

  private async fetchLogs() {
    const logs = await fetchLogs(this.source, this.sort, this.logLimit);
    this.onUpdateLogs(logs);
  }
}
