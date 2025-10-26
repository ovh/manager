import { ReactNode } from 'react';

import { vitest } from 'vitest';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import type { ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { render } from '@/setupTest';

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
    navigation: {
      navigateTo: vitest.fn(),
      reload: vitest.fn(),
    },
    ux: {
      hidePreloader: vitest.fn(),
    },
  },
};

export const renderWithContext = ({ children }: { children: ReactNode }) =>
  render(
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>,
  );
