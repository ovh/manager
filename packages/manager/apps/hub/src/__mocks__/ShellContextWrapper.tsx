import { ReactNode } from 'react';

import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { deepMerge } from '@/utils/deepMerge';

const baseShellContext = {
  region: 'EU',
  environment: {
    getRegion: vi.fn(() => baseShellContext.region),
  },
};

export const renderWithShellContext = (
  component: ReactNode,
  contextOverrides: Partial<ShellContextType> = {},
) =>
  render(
    <ShellContext.Provider
      value={
        deepMerge(baseShellContext, contextOverrides, {
          arrayMode: 'concat',
        }) as ShellContextType
      }
    >
      {component}
    </ShellContext.Provider>,
  );
