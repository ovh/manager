import React from 'react';
import { Meta } from '@storybook/react';
import { GuideMenu, GuideMenuProps } from '@ovh-ux/manager-ui-kit';

const guideItems = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: '_blank',
    children: 'ovh.com',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: '_blank',
    children: 'Guides OVH',
  },
];

export const GuideMenuExemple: GuideMenuProps = {
  items: guideItems,
};

export const GuideMenuLoading = () => (
  <GuideMenu isLoading items={guideItems} />
);

export const GuideMenuEmpty = () => <GuideMenu items={[]} />;

const meta: Meta<GuideMenuProps> = {
  title: 'Manager UI Kit/Components/GuideMenu',
  decorators: [(story) => <div>{story()}</div>],
  component: GuideMenu,
  argTypes: {},
  args: GuideMenuExemple,
};

export default meta;
