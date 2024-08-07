import { renderHook } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { describe, vi } from 'vitest';
import { useHidePreloader } from './useHidePreloader';

const shellContext = {
  shell: {
    ux: {
      hidePreloader: vi.fn(),
    },
  },
};

describe('useHidePreloader hook', () => {
  test('Should call the hidePreloader() function correctly', () => {
    const { rerender } = renderHook(() => useHidePreloader(), {
      wrapper: (props) => (
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          {props.children}
        </ShellContext.Provider>
      ),
    });

    expect(shellContext.shell.ux.hidePreloader).toHaveBeenCalled();
    rerender();
    expect(shellContext.shell.ux.hidePreloader).toHaveBeenCalledTimes(1);
  });
});
