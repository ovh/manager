import { ReactNode } from 'react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { render } from './test.provider';

export const mockTrackPage = vitest.fn();
export const mockGetEnvironment = vitest.fn();

export const shellContext = {
  shell: {
    environment: {
      getEnvironment: mockGetEnvironment,
    },
    tracking: {
      trackPage: mockTrackPage,
    },
  },
};

export const renderWithContext = ({ children }: { children: ReactNode }) =>
  render(
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>,
  );
