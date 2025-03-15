import { withRouter } from 'storybook-addon-react-router-v6';
import { Meta } from '@storybook/react';
import { ErrorBoundary } from './error-boundary.component';

export const defaultsProps = {
  redirectionApp: 'vrack-services-test',
};

const meta: Meta = {
  title: 'Templates/ErrorBoundary',
  component: ErrorBoundary,
  decorators: [withRouter],
  argTypes: {
    defaultsProps,
  },
};

export default meta;
