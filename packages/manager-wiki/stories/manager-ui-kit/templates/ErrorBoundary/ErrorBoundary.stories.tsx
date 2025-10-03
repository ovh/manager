import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Meta } from '@storybook/react';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';

const defaultsProps = {
  redirectionApp: 'vrack-services-test',
  isPreloaderHide: false,
  isRouteShellSync: false,
};

const meta: Meta = {
  title: 'Manager React Components/Components/ErrorBoundary',
  component: ErrorBoundary,
  decorators: [withRouter],
  args: defaultsProps,
};

export default meta;

export const DefaultErrorBoundary = () => <ErrorBoundary {...defaultsProps} />;
