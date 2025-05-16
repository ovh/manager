import { withRouter } from 'storybook-addon-react-router-v6';
import { Meta } from '@storybook/react';
import { ErrorBoundary } from './error-boundary.component';

export const defaultsProps = {
  args: {
    redirectionApp: 'vrack-services-test',
    isPreloaderHide: false,
    isRouteShellSync: false,
  },
};

const meta: Meta = {
  title: 'Core/Manager React Components/Templates/ErrorBoundary',
  component: ErrorBoundary,
  decorators: [withRouter],
};

export default meta;
