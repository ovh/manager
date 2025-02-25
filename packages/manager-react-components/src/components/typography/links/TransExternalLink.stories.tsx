import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  TransExternalLink,
  TTransExternalLinkProps,
} from './TransExternalLink.component';

const transExternalLink: TTransExternalLinkProps = {
  href: 'https://www.ovhcloud.com/',
  i18nKey: 'order_summary_order_initiated_subtitle',
  i18nNamespace: 'order',
};

const meta: Meta<TTransExternalLinkProps> = {
  title: 'Typography/Links/Translation',
  component: TransExternalLink,
  args: transExternalLink,
};

export default meta;

export const TranslatedExternalLink: StoryObj<typeof TransExternalLink> = {
  args: transExternalLink,
  render: (args) => <TransExternalLink {...args} />,
};
