import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import Layout from '@/pages/layout';

const shellContext = {
  environment: {
    getUser: vi.fn(),
  },
  shell: {
    ux: {
      hidePreloader: vi.fn(),
    },
  },
};

const renderComponent = () =>
  render(
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      <Layout />
    </ShellContext.Provider>,
  );

const mockPath = '/foo';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockPath,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: vi.fn(() => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
      trackCurrentPage: vi.fn(),
      usePageTracking: vi.fn(),
    })),
    useRouteSynchro: vi.fn(() => {}),
  };
});

describe('Form.page', () => {
  it('should render select LegalForms correctly when the sub is FR and legalForms is other', async () => {
    const { getByText } = renderComponent();

    expect(getByText('Layout')).not.toBeNull();
  });
});
