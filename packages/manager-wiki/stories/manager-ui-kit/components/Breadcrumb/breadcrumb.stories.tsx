import React from 'react';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-react-router-v6';
import { Breadcrumb } from '@ovh-ux/muk';

const BreadcrumbStory = (args) => {
  return (
    <Breadcrumb
      rootLabel={args.rootLabel}
      appName={args.appName}
      hideRootLabel={args.hideRootLabel}
    />
  );
};

export const Basic = BreadcrumbStory.bind({});

Basic.args = {
  appName: 'vrack-services',
  rootLabel: 'vRack Services',
  hideRootLabel: false,
};

Basic.parameters = {
  docs: {
    source: {
      code: `<Breadcrumb
  rootLabel="vRack Services"
  appName="vrack-services"
  hideRootLabel={false}
/>`,
    },
  },
};

export const HideRootLabel = BreadcrumbStory.bind({});

HideRootLabel.args = {
  rootLabel: 'vRack Services',
  appName: 'vrack-services',
  hideRootLabel: true,
};

HideRootLabel.parameters = {
  docs: {
    source: {
      code: `<Breadcrumb
  rootLabel="vRack Services"
  appName="vrack-services"
  hideRootLabel={true}
/>`,
    },
  },
};

export default {
  title: 'Manager UI Kit/Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  decorators: [withRouter],
  parameters: {
    docs: {
      description: {
        component: 'Breadcrumb component',
      },
    },
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { userId: 'vrs-yyy-xxx-yyy-xxx' },
      },
      routing: { path: '/:userId/subnets/listing' },
    }),
  },
};
