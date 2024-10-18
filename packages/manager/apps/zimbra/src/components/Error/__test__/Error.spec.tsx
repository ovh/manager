import React from 'react';
import { describe, expect, vi } from 'vitest';
import { render } from '@/utils/test.provider';
import ErrorBanner from '../Error';

vi.mock('@ovh-ux/manager-react-core-application', async (importActual) => {
  return {
    ...(await importActual<
      typeof import('@ovh-ux/manager-react-core-application')
    >()),
    useShell: vi.fn(() => ({
      tracking: {
        trackPage: vi.fn(),
      },
      environment: {
        getEnvironment: vi.fn(() => Promise.resolve({})),
      },
    })),
  };
});

describe('Error component', () => {
  it('should render', async () => {
    const { getByText } = render(
      <ErrorBanner error={{ data: { message: 'test' } }} />,
    );
    expect(getByText('test')).toBeInTheDocument();
  });
});
