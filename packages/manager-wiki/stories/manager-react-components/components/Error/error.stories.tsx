import React from 'react';
import { Meta } from '@storybook/react';
import { Error, ErrorProps } from '@ovh-ux/manager-react-components';

export const defaultProps: ErrorBannerProps = {
  error: {
    status: 404,
    data: { message: "Votre requête n'a pas abouti" },
    headers: { 'x-ovh-queryid': '123456789' },
  },
};

const meta: Meta<typeof Error> = {
  title: 'Manager React Components/Errors',
  decorators: [(story) => <div>{story()}</div>],
  component: Error,
  argTypes: {},
  args: defaultProps,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
