/* eslint-disable no-nested-ternary */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

import { Component, Prop, h } from '@stencil/core';

import { LogEntry, getColorType } from './tailLogsTypes';

@Component({
  tag: 'msc-tail-logs-code',
})
export class MscTailLogsCode {
  @Prop() public logs: LogEntry[] = [];

  @Prop() public logLimit = 0;

  render() {
    if (this.logs.length === 0) {
      return <div>No logs available.</div>;
    }

    const hasTimestamp = 'timestamp' in this.logs[0]; // Check if logs have a 'timestamp' property

    return (
      <table class="msc-tail-table-wrapper">
        <thead>
          <tr>
            {hasTimestamp && <th>Timestamp</th>}
            {Object.keys(this.logs[0])
              .filter((key) => key !== 'timestamp')
              .map((entryName) => (
                <th>{entryName}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {this.logs.map((logEntry) => (
            <tr>
              {hasTimestamp && (
                <td>
                  <osds-text
                    level="caption"
                    color={
                      logEntry.message.includes(logEntry.message)
                        ? getColorType(logEntry.message)
                        : ''
                    }
                    size="200"
                  >
                    {new Date(logEntry.timestamp * 1000).toISOString()}
                  </osds-text>
                </td>
              )}
              {Object.entries(logEntry)
                .filter(([key]) => key !== 'timestamp')
                .map(([, value]) => (
                  <td>
                    <osds-text
                      level="caption"
                      color={
                        logEntry.message.includes(logEntry.message)
                          ? getColorType(logEntry.message)
                          : ''
                      }
                      size="200"
                    >
                      {value}
                    </osds-text>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
