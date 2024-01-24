import { Component, Prop, h, Element, Host, State, Watch } from '@stencil/core';
import { apiClient } from '@ovh-ux/manager-core-api';
import { HTMLStencilElement } from '@stencil/core/internal';
import { Locale, defaultLocale } from '@ovhcloud/msc-utils';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { getTranslations, Translations } from './translations';
import { LogEntry, SortOrder } from './msc-tail-logs.type';

export type ApiVersion = keyof typeof apiClient;

export interface IMscTailLogs {
  source: string;
  sort?: SortOrder;
  limit?: number;
  apiVersion?: ApiVersion;
  refreshInterval?: number;
  autoRefresh?: boolean;
  locale?: Locale;
}

const DEFAULT_LOGS_REFRESH_INTERVAL = 30000;
const DEFAULT_LOGS_LIMIT = 500;
const DEFAULT_SORT: SortOrder = 'asc';

@Component({
  tag: 'msc-tail-logs',
  styleUrl: 'msc-tail-logs.scss',
  shadow: true,
})
export class MscTailLogs implements IMscTailLogs {
  @Element() host!: HTMLStencilElement;

  @Prop() public source: string;

  @Prop() public sort = DEFAULT_SORT;

  @Prop() public limit = DEFAULT_LOGS_LIMIT;

  @Prop() public apiVersion: ApiVersion = 'v6' as ApiVersion;

  @Prop() public refreshInterval = DEFAULT_LOGS_REFRESH_INTERVAL;

  @Prop() public locale = defaultLocale;

  @Prop({ mutable: true }) public autoRefresh = false;

  @State() private localeStrings?: Translations;

  @State() private logEntryList: LogEntry[] | null = null;

  @State() private intervalId: NodeJS.Timer;

  @State() private hasError = false;

  @Watch('locale')
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.locale);
  }

  fetchLogs = () => {
    const queryParams = `?sort=${this.sort}&limit=${this.limit}`;
    apiClient[this.apiVersion]
      .get(`${this.source}${queryParams}`)
      .then((response) => {
        if (!response.data) {
          this.hasError = true;
          this.logEntryList = null;
        }
        this.logEntryList = response.data;
      })
      .catch(() => {
        this.hasError = true;
        this.logEntryList = null;
      });
  };

  @Watch('autoRefresh')
  setupRefresh() {
    if (this.autoRefresh) {
      this.intervalId = setInterval(
        () => this.fetchLogs(),
        this.refreshInterval,
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      clearInterval(this.intervalId);
    }
  }

  async componentWillLoad() {
    this.updateTranslations();
    this.fetchLogs();
    this.setupRefresh();
  }

  render() {
    if (!this.localeStrings) {
      return (
        <Host>
          <osds-skeleton />
        </Host>
      );
    }

    return (
      <Host>
        <section class="msc-tail-logs-wrapper">
          <osds-toggle
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => {
              if (this.logEntryList !== null) {
                this.autoRefresh = !this.autoRefresh;
              }
            }}
            disabled={this.logEntryList === null}
            checked={this.autoRefresh}
          >
            <osds-text
              slot="start"
              level="heading"
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {this.localeStrings.refresh_button_label}
            </osds-text>
          </osds-toggle>
          {!this.hasError && this.logEntryList === null ? (
            <osds-skeleton flex />
          ) : (
            <osds-code>
              {this.hasError && (
                <osds-text
                  level={ODS_TEXT_LEVEL.caption}
                  size={ODS_TEXT_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.error}
                >
                  {this.localeStrings.service_error_message}
                </osds-text>
              )}
              {this.logEntryList?.length === 0 && this.localeStrings.empty_logs}
              {this.logEntryList && this.logEntryList.length > 0 && (
                <msc-tail-logs-code logs={this.logEntryList} />
              )}
            </osds-code>
          )}
        </section>
      </Host>
    );
  }
}
