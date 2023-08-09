/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import {
  Component,
  Prop,
  Element,
  Host,
  h,
  State,
  Watch,
  Method,
} from '@stencil/core';
import '@ovhcloud/ods-theme-blue-jeans/index.css';
import { HTMLStencilElement } from '@stencil/core/internal';
import './msc-tail-logs-code';
import { SortOrder, LogEntry } from './tailLogsTypes';
import { LogsRefreshService } from './logsRefreshService';
import { fetchLogs } from './logsService';

const LOGS_REFRESH_INTERVAL = 30000;
const LOGS_LIMIT = 500;

@Component({
  tag: 'msc-tail-logs',
  styleUrl: 'msc-tail-logs.scss',
  shadow: true,
})
export class MscTailLogs {
  @Prop() serviceName?: string = '';

  @Prop() source?: string = '';

  @Prop() sort?: SortOrder = SortOrder.Ascending;

  @Prop({ mutable: true }) isToggled?: boolean = false;

  @Prop() logsRefresh?: number = LOGS_REFRESH_INTERVAL;

  @Prop() logLimit = LOGS_LIMIT;

  @Element() host!: HTMLStencilElement;

  @State() private logs: LogEntry[] = [];

  private logsRefreshService: LogsRefreshService | null = null;

  async componentWillLoad() {
    await this.refreshLogs();
  }

  componentDidLoad() {
    if (this.isToggled) {
      this.startLogsRefresh();
    }
  }

  @Watch('isToggled')
  toggleChanged(newValue: boolean) {
    if (newValue) {
      this.startLogsRefresh();
    } else {
      this.stopLogsRefresh();
    }
  }

  @Method()
  async refreshLogs() {
    if (this.logsRefreshService) {
      await this.logsRefreshService.startLogsRefreshInterval();
    } else {
      const logs = await fetchLogs(
        this.source || '',
        this.sort || SortOrder.Ascending,
        this.logLimit,
      );
      this.logs = logs;
    }
  }

  private onUpdateLogs = (logs: LogEntry[]) => {
    this.logs = logs;
  };

  private startLogsRefresh() {
    this.logsRefreshService = new LogsRefreshService(
      this.source || '',
      this.sort || SortOrder.Ascending,
      this.logLimit,
      this.logsRefresh || LOGS_REFRESH_INTERVAL,
      this.onUpdateLogs,
    );
    this.logsRefreshService.startLogsRefreshInterval();
  }

  private stopLogsRefresh() {
    if (this.logsRefreshService) {
      this.logsRefreshService.stopLogsRefreshInterval();
      this.logsRefreshService = null;
    }
  }

  private toggleClicked() {
    this.isToggled = !this.isToggled;
  }

  render() {
    if (this.logs.length === 0) {
      return <osds-code>Aucun message</osds-code>;
    }

    return (
      <Host>
        <div class="msc-tail-wrapper">
          <div>
            <osds-text level="heading" color="text">
              Auto-Refresh
            </osds-text>
          </div>
          <osds-toggle
            color="primary"
            onClick={() => this.toggleClicked()}
            checked={this.isToggled}
          />
          <osds-code>
            <msc-tail-logs-code logs={this.logs} logLimit={this.logLimit} />
          </osds-code>
        </div>
      </Host>
    );
  }
}
