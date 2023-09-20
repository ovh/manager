import { setupWorker } from 'msw';
import { localeList, defaultLocale } from '@ovhcloud/msc-utils';
import handlers from '../mock/handlers';
import { IMscTailLogs } from '../src';

setupWorker(...handlers).start({ onUnhandledRequest: 'bypass' });

export default {
  title: 'Components/Manager Tail logs',
  tags: ['autodocs'],
  render: ({
    source,
    sort = 'asc',
    refreshInterval = 30000,
    limit = 500,
    autoRefresh,
    locale = defaultLocale,
  }: IMscTailLogs) => `
    <section>
      <msc-tail-logs
        source="${source}"
        sort="${sort}"
        limit="${limit}"
        refresh-interval="${refreshInterval}"
        locale="${locale}"
        ${autoRefresh ? 'auto-refresh' : ''}/>
    </section>
  `,
  argTypes: {
    source: {
      description: 'API path to fetch logs',
      control: 'select',
      options: [
        'cloud/project/11111111111111111111/database/mongodb/11111111-11111-111111-1111111111/logs',
        'cloud/project/22222222222222222222/database/mongodb/22222222-22222-222222-2222222222/logs',
        'cloud/project/33333333333333333333/database/mongodb/33333333-33333-333333-3333333333/logs',
        'cloud/project/emptylogs/database/mongodb/44444444444-4444-44444444444444/logs',
        'cloud/project/servererror/database/mongodb/55555555555-5555-55555555555555/logs',
        '404notfound',
      ],
    },
    sort: {
      description:
        "Sort order of the log lines (won't change anything with mocked data)",
      control: 'radio',
      options: ['asc', 'desc'],
      table: {
        defaultValue: { summary: 'asc' },
      },
    },
    limit: {
      description:
        "Number of fetched log lines (won't change anything with mocked data)",
      control: 'radio',
      options: [500, 2],
      table: {
        defaultValue: { summary: 500 },
      },
    },
    refreshInterval: {
      description: 'Interval in milliseconds between each refreshes',
      control: {
        type: 'number',
        min: 1000,
        max: 60000,
        step: 1000,
      },
      table: {
        defaultValue: { summary: 30000 },
      },
    },
    autoRefresh: {
      description: 'Set auto-refresh to true by default',
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
      },
    },
    locale: {
      description: 'Locale of the labels',
      control: 'select',
      options: localeList,
      table: {
        defaultValue: { summary: defaultLocale },
      },
    },
  },
  args: {
    source:
      'cloud/project/11111111111111111111/database/mongodb/11111111-11111-111111-1111111111/logs',
    sort: 'asc',
    limit: 500,
    refreshInterval: 30000,
    autoRefresh: false,
    locale: defaultLocale,
  },
};

export const LogsAsc = {
  args: {
    source:
      'cloud/project/11111111111111111111/database/mongodb/11111111-11111-111111-1111111111/logs',
  },
};

export const LogsDesc = {
  args: {
    source:
      'cloud/project/33333333333333333333/database/mongodb/33333333-33333-333333-3333333333/logs',
  },
};

export const LogsLimited = {
  args: {
    source:
      'cloud/project/22222222222222222222/database/mongodb/22222222-22222-222222-2222222222/logs',
  },
};

export const EmptyLogs = {
  args: {
    source:
      'cloud/project/emptylogs/database/mongodb/44444444444-4444-44444444444444/logs',
  },
};

export const ServerError = {
  args: {
    source:
      'cloud/project/servererror/database/mongodb/55555555555-5555-55555555555555/logs',
  },
};
