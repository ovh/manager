import { Meta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import {
  ChangelogMenu,
  ChangelogMenuLinks,
  ChangelogMenuProps,
} from '@ovh-ux/manager-react-components';

const changelogChapters: string[] = ['baremetal', 'server', 'dedicated'];
const changelogLinks: ChangelogMenuLinks = {
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
};

export const changelogMenu: ChangelogMenuProps = {
  links: changelogLinks,
  chapters: changelogChapters,
};

const meta: Meta<ChangelogMenuProps> = {
  title: 'Manager React Components/Components/ChangelogMenu',
  decorators: [withRouter],
  component: ChangelogMenu,
  argTypes: {},
  args: changelogMenu,
};

export default meta;
