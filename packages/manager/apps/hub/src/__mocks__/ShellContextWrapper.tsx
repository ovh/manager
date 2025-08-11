/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';
import { render } from '@testing-library/react';
/* eslint-enable import/no-extraneous-dependencies */
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { ReactNode } from 'react';
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
