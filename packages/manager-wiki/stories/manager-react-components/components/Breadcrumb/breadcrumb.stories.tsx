import React from 'react';
import {
  withRouter,
  reactRouterParameters,
} from 'storybook-addon-react-router-v6';
import { Breadcrumb } from '@ovh-ux/manager-react-components';

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
  rootLabel: 'vRack Services',
  appName: 'vrack-services',
  hideRootLabel: false,
};

export const HideRootLabel = BreadcrumbStory.bind({});

HideRootLabel.args = {
  rootLabel: 'vRack Services',
  appName: 'vrack-services',
  hideRootLabel: true,
};

export default {
  title: 'Manager React Components/Components/Breadcrumb',
  component: Breadcrumb,
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
