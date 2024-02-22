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
  title: 'Templates/Errors',
  decorators: [(story) => <div className="w-2/3">{story()}</div>],
  component: ErrorBanner,
  argTypes: {},
  args: defaultProps,
};

export default meta;
