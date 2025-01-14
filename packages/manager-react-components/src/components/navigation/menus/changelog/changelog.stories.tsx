import React from 'react';
import { Meta } from '@storybook/react';
import {
  ChangelogButton,
  ChangelogButtonProps,
  ChangelogItem,
} from './changelog.component';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

const changelogItems: ChangelogItem[] = [
  {
    id: 1,
    href: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
    target: OdsHTMLAnchorElementTarget._blank,
    labelKey: 'roadmap',
  },
  {
    id: 2,
    href: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Baremetal',
    target: OdsHTMLAnchorElementTarget._blank,
    labelKey: 'changelog',
  },
  {
    id: 3,
    href: 'https://github.com/ovh/infrastructure-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
    target: OdsHTMLAnchorElementTarget._blank,
    labelKey: 'feature-request',
  },
];

export const changelogButton: ChangelogButtonProps = {
  items: changelogItems,
};

const meta: Meta<ChangelogButtonProps> = {
  title: 'Navigation/Menus',
  decorators: [(story) => <div>{story()}</div>],
  component: ChangelogButton,
  argTypes: {},
  args: changelogButton,
};

export default meta;
