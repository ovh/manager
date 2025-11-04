import { vi } from 'vitest';

import { ActionMenuProps, type ChangelogMenuLinks, type GuideMenuItem } from '@/components';
import { Notification, NotificationType } from '@/components/notifications/Notifications.props';
import { DEFAULT_UNKNOWN_DATE_LABEL } from '@/hooks/date/date-formatter/FormatDate.type';

export const MOCK_ACTION_BANNER = {
  message: 'hello world',
  label: 'custom action',
} as const;

export const MOCK_URL = 'https://www.ovhcloud.com';

export const BASE_ITEMS: NonNullable<ActionMenuProps['items']> = [
  {
    id: 1,
    onClick: vi.fn(),
    label: 'Action 1',
    urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
  {
    id: 2,
    onClick: vi.fn(),
    label: 'Action 2',
    urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
  {
    id: 3,
    href: 'https://www.ovhcloud.com',
    target: '_blank',
    label: 'External Link',
  },
  {
    id: 4,
    href: `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ name: 'john' }))}`,
    download: 'test.json',
    target: '_blank',
    label: 'Download File',
  },
  {
    id: 5,
    href: 'https://ovhcloud.com',
    target: '_blank',
    label: 'Disabled Link',
    isDisabled: true,
  },
];

export const guideMenuItems: GuideMenuItem[] = [
  { id: 1, href: 'https://www.ovhcloud.com/', children: 'Guide Menu Item Label' },
];

export const changelogLinks: ChangelogMenuLinks = {
  changelog: '',
  roadmap: '',
  'feature-request': '',
};

export const BREADCRUMB_DEFAULT_PROPS = {
  rootLabel: 'vRack services',
  appName: 'vrack-services',
};

export const longUrls = {
  changelog:
    'https://very-long-url-that-might-affect-rendering.com/path/to/changelog?param1=value1&param2=value2&param3=value3',
  roadmap:
    'https://very-long-url-that-might-affect-rendering.com/path/to/roadmap?param1=value1&param2=value2&param3=value3',
  'feature-request':
    'https://very-long-url-that-might-affect-rendering.com/path/to/feature-request?param1=value1&param2=value2&param3=value3',
};

export const notifications: Notification[] = [
  {
    uid: 1,
    content: 'This is a success message.',
    type: NotificationType.Success,
    dismissible: true,
  },
  {
    uid: 2,
    content: 'This is an error message.',
    type: NotificationType.Error,
    dismissible: false,
  },
  {
    uid: 3,
    content: 'This is an alert message.',
    type: NotificationType.Warning,
    dismissible: false,
  },
  {
    uid: 4,
    content: 'This is an information message.',
    type: NotificationType.Info,
  },
];

export const tags = {
  tag1: 'tag1',
  tag2: 'tag2',
  tag3: 'tag3',
  tag4: 'tag4',
  'ovh:tag1': 'ovh:tag1',
  'ovh:tag2': 'ovh:tag2',
  'ovh:tag3': 'ovh:tag3',
};

export const dates = [
  {
    case: 'label for no date',
    input: 'invalid',
    dateString: undefined,
    format: undefined,
    expected: DEFAULT_UNKNOWN_DATE_LABEL,
  },
  {
    case: 'label for no date',
    input: 'empty',
    dateString: '',
    format: undefined,
    expected: DEFAULT_UNKNOWN_DATE_LABEL,
  },
  {
    case: 'a valid date',
    input: 'null',
    dateString: null,
    format: undefined,
    expected: 'N/A',
  },
  {
    case: 'a valid date with abbreviated month',
    input: 'valid',
    dateString: '2024-09-14T09:21:21.943Z',
    format: undefined,
    expected: '14 sept. 2024',
  },
  {
    case: 'a valid date with abbreviated month',
    input: 'valid',
    dateString: '2024-10-14T09:21:21.943Z',
    format: 'PP',
    expected: '14 oct. 2024',
  },
  {
    case: 'a valid date with non-abbreviated month',
    input: 'valid',
    dateString: '2024-09-14T09:21:21.943Z',
    format: 'PPP',
    expected: '14 septembre 2024',
  },
  {
    case: 'a valid date with compact format',
    input: 'valid and format is compact',
    dateString: '2024-06-14T09:21:21.943Z',
    format: 'P',
    expected: '14/06/2024',
  },
  {
    case: 'a valid date with compact format and time format (CEST)',
    input: 'valid and format is compact with time',
    dateString: '2024-06-14T09:21:21.943Z',
    format: 'Pp',
    expected: '14/06/2024, 09:21',
  },
  {
    case: 'a valid date with compact format and time format (CET)',
    input: 'valid and format is compact with time',
    dateString: '2024-01-14T09:21:21.943Z',
    format: 'Pp',
    expected: '14/01/2024, 09:21',
  },
  {
    case: 'a valid date with display format and time format (CET)',
    input: 'valid and format is compact with time',
    dateString: '2024-01-14T09:21:21.943Z',
    format: 'PPp',
    expected: '14 janv. 2024, 09:21',
  },
  {
    case: 'a valid date with full display format and time format (CET)',
    input: 'valid and format is compact with time',
    dateString: '2024-01-14T09:21:21.943Z',
    format: 'PPPpp',
    expected: '14 janvier 2024 à 09:21:21',
  },
];

export const englishDates = [
  {
    case: 'label for no date',
    input: 'invalid',
    dateString: undefined,
    format: undefined,
    expected: DEFAULT_UNKNOWN_DATE_LABEL,
  },
  {
    case: 'label for no date',
    input: 'empty',
    dateString: '',
    format: undefined,
    expected: DEFAULT_UNKNOWN_DATE_LABEL,
  },
  {
    case: 'a valid date',
    input: 'null',
    dateString: null,
    format: undefined,
    expected: 'N/A',
  },
  {
    case: 'a valid date with abbreviated month',
    input: 'valid',
    dateString: '2024-09-14T09:21:21.943Z',
    format: undefined,
    expected: '14 Sep 2024',
  },
  {
    case: 'a valid date with abbreviated month',
    input: 'valid',
    dateString: '2024-10-14T09:21:21.943Z',
    format: 'PP',
    expected: '14 Oct 2024',
  },
  {
    case: 'a valid date with non-abbreviated month',
    input: 'valid',
    dateString: '2024-09-14T09:21:21.943Z',
    format: 'PPP',
    expected: '14 September 2024',
  },
  {
    case: 'a valid date with compact format',
    input: 'valid and format is compact',
    dateString: '2024-06-14T09:21:21.943Z',
    format: 'P',
    expected: '14/06/2024',
  },
  {
    case: 'a valid date with compact format and time format (CEST)',
    input: 'valid and format is compact with time',
    dateString: '2024-06-14T09:21:21.943Z',
    format: 'Pp',
    expected: '14/06/2024, 09:21',
  },
  {
    case: 'a valid date with compact format and time format (CET)',
    input: 'valid and format is compact with time',
    dateString: '2024-01-14T09:21:21.943Z',
    format: 'Pp',
    expected: '14/01/2024, 09:21',
  },
  {
    case: 'a valid date with display format and time format (CET)',
    input: 'valid and format is compact with time',
    dateString: '2024-01-14T09:21:21.943Z',
    format: 'PPp',
    expected: '14 Jan 2024, 09:21',
  },
  {
    case: 'a valid date with full display format and time format (CET)',
    input: 'valid and format is compact with time',
    dateString: '2024-01-14T09:21:21.943Z',
    format: 'PPPpp',
    expected: '14 January 2024 at 09:21:21',
  },
];
