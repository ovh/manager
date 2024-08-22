import React from 'react';
import { Meta } from '@storybook/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { GuideButton, GuideButtonProps } from './guide.component';

const guideItems = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: OdsHTMLAnchorElementTarget._blank,
    label: 'ovh.com',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: OdsHTMLAnchorElementTarget._blank,
    label: 'Guides OVH',
  },
];

export const guideButton: GuideButtonProps = {
  items: guideItems,
};

const meta: Meta<GuideButtonProps> = {
  title: 'Navigation/Menus',
  decorators: [(story) => <div>{story()}</div>],
  component: GuideButton,
  argTypes: {},
  args: guideButton,
};

export default meta;
