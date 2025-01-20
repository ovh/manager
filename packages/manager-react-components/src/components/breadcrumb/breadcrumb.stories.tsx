import React from 'react';
import {
  withRouter,
  reactRouterParameters,
} from 'storybook-addon-react-router-v6';
import { Breadcrumb } from './breadcrumb.component';

const BreadcrumbStory = (args) => {
  return <Breadcrumb rootLabel={args.rootLabel} appName={args.appName} />;
};

export const Basic = BreadcrumbStory.bind({});

Basic.args = {
  rootLabel: 'vRack Services',
  appName: 'vrack-services',
};

export default {
  title: 'Components/Breadcrumb',
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
