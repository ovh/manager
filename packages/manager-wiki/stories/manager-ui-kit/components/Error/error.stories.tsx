import React from 'react';
import { Meta } from '@storybook/react';
import { Error, ErrorProps } from '@ovh-ux/muk';

const defaultError: ErrorProps = {
  error: {},
};

const error404: ErrorProps = {
  error: {
    status: 404,
  },
};

const errorApiWithCode: ErrorProps = {
  error: {
    status: 401,
    data: {
      message: '[serviceId] Given data (undefined) is not valid for type long',
    },
    headers: { 'x-ovh-queryid': '123456789' },
  },
};

const meta: Meta<typeof Error> = {
  title: 'Manager UI Kit/Components/Errors',
  decorators: [(story) => <div>{story()}</div>],
  component: Error,
  argTypes: {},
  args: defaultError,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const ErrorBoundary = () => <Error {...defaultError} />;
export const Error404 = () => <Error {...error404} />;
export const ErrorApiWithCode = () => <Error {...errorApiWithCode} />;
