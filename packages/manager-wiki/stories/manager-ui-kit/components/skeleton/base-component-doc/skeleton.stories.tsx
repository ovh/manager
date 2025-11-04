import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton, type SkeletonProp } from '@ovhcloud/ods-react';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<SkeletonProp>;

(Skeleton as any).__docgenInfo = docgenMap.skeleton;

const meta: Meta<SkeletonProp> = {
  component: Skeleton,
  title: 'Manager UI Kit/Components/Skeleton/Base',
};

export default meta;

export const Demo: Story = {};

export const Default: Story = {
  globals: {
    imports: `import { Skeleton } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Skeleton />
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Skeleton />
  ),
};

export const AccessibilityLoading: Story = {
  globals: {
    imports: `import { Skeleton } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <div aria-busy="true">
      <Skeleton />
    </div>
  ),
};

export const AccessibilityBadPracticeLoading: Story = {
  globals: {
    imports: `import { Skeleton } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <div>
      <Skeleton />
    </div>
  ),
};
