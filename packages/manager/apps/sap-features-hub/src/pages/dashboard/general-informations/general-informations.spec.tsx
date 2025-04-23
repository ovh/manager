import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import GeneralInformations from './index';

vi.mock('@ovh-ux/manager-react-components', () => ({
  Links: vi.fn().mockReturnValue(<div></div>),
  LinkType: vi.fn().mockReturnValue('External'),
  DashboardTile: vi.fn().mockReturnValue(<div>Block Tile</div>),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));
const queryClient = new QueryClient();
const shellContext = {
  shell: {
    environment: {
      user: { ovhSubsidiary: 'FR' },
      getRegion: vi.fn(),
      getEnvironment: () => {
        return {
          getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
        };
      },
    },
  },
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const wrapper = ({ children }) => (
  <ShellContext.Provider value={(shellContext as unknown) as ShellContextType}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ShellContext.Provider>
);

describe('general information page', () => {
  it('page is displayed and 5 tiles appears.', () => {
    const { getAllByText } = render(<GeneralInformations />, { wrapper });
    expect(getAllByText('Block Tile')).toHaveLength(5);
  });
});
