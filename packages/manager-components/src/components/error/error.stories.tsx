/* eslint-disable import/no-extraneous-dependencies */
import { BrowserRouter as Router } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { ErrorBanner } from './error.component';

import { ErrorBannerProps } from './error.types';

export const defaultProps: ErrorBannerProps = {
  error: {
    status: 404,
    data: { message: "Votre requête n'a pas abouti" },
    headers: { 'x-ovh-queryid': '123456789' },
  },
};

const meta: Meta<typeof ErrorBanner> = {
  title: 'Atoms/errors',
  decorators: [
    (story) => (
      <Router>
        <div>{story()}</div>
      </Router>
    ),
  ],
  component: ErrorBanner,
  argTypes: {},
  args: defaultProps,
};

export default meta;
