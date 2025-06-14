import React from 'react';
import { Meta } from '@storybook/react';
import {
  GuideButton,
  GuideButtonProps,
} from '@ovh-ux/manager-react-components';

const guideItems = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: '_blank',
    label: 'ovh.com',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: '_blank',
    label: 'Guides OVH',
  },
];

export const guideButton: GuideButtonProps = {
  items: guideItems,
};

export const GuideButtonLoading = () => (
  <GuideButton isLoading items={guideItems} />
);

const meta: Meta<GuideButtonProps> = {
  title: 'Manager React Components/Navigation/Menus',
  decorators: [(story) => <div>{story()}</div>],
  component: GuideButton,
  argTypes: {},
  args: guideButton,
};

export default meta;
