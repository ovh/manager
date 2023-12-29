import { Component, Prop, h } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { LogEntry } from './msc-tail-logs.type';

function getMessageColor(
  message: string,
): { color: ODS_THEME_COLOR_INTENT; contrasted?: boolean } {
  if (
    /warning/i.test(message) ||
    /status\s*>=\s*300\s*&&\s*status\s*<\s*499/i.test(message)
  ) {
    return { color: ODS_THEME_COLOR_INTENT.warning };
  }
  if (/crit|alert|emerg/i.test(message) || /status\s*> 499/i.test(message)) {
    return { color: ODS_THEME_COLOR_INTENT.error };
  }
  if (/debug/i.test(message)) {
    return { color: ODS_THEME_COLOR_INTENT.default };
  }
  return { color: ODS_THEME_COLOR_INTENT.default, contrasted: true };
}

export interface IMscTailLogsCode {
  logs: LogEntry[];
}

@Component({
  tag: 'msc-tail-logs-code',
  styleUrl: 'msc-tail-logs-code.scss',
  shadow: true,
})
export class MscTailLogsCode implements IMscTailLogsCode {
  @Prop() public logs: LogEntry[] = [];

  render() {
    return (
      <table class="msc-tail-logs-table-wrapper">
        <thead>
          <tr>
            {this.logs[0].timestamp && <th>Timestamp</th>}
            {Object.keys(this.logs[0])
              .filter((key) => key !== 'timestamp')
              .map((entryName) => (
                <th key={entryName}>{entryName}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {this.logs.map((log) => {
            const messageColor = getMessageColor(log.message);
            return (
              <tr key={`${log.timestamp}-${log.message}`}>
                {log.timestamp && (
                  <td>
                    <osds-text
                      level={ODS_TEXT_LEVEL.caption}
                      size={ODS_TEXT_SIZE._200}
                      {...messageColor}
                    >
                      {new Date(log.timestamp * 1000).toISOString()}
                    </osds-text>
                  </td>
                )}
                {Object.entries(log)
                  .filter(([key]) => key !== 'timestamp')
                  .map(([, value]) => (
                    <td key={value}>
                      <osds-text
                        level={ODS_TEXT_LEVEL.caption}
                        size={ODS_TEXT_SIZE._200}
                        {...messageColor}
                      >
                        {value}
                      </osds-text>
                    </td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
