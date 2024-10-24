import { renderHook } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { describe, vi } from 'vitest';
import * as ReactRouterDom from 'react-router-dom';
import { useShellRoutingSync } from './useShellRoutingSync';

const location1: ReactRouterDom.Location = {
  pathname: '/pci/projects/12345/instances',
  search: '',
  hash: '',
  state: '',
  key: 'foo',
};

const location2: ReactRouterDom.Location = {
  ...location1,
  pathname: '/pci/projects/12345/instances/new',
  key: 'bar',
};

const shellContext = {
  shell: {
    routing: {
      onHashChange: vi.fn(),
      stopListenForHashChange: vi.fn(),
    },
  },
};

const mockedUseLocation = vi.spyOn(ReactRouterDom, 'useLocation');

describe('useShellRoutingSync hook', () => {
  test('Should call the stopListenForHashChange() & onHashChange() functions correctly', () => {
    mockedUseLocation.mockReturnValueOnce(location1).mockReturnValue(location2);

    const { rerender } = renderHook(() => useShellRoutingSync(), {
      wrapper: (props) => (
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          {props.children}
        </ShellContext.Provider>
      ),
    });

    expect(
      shellContext.shell.routing.stopListenForHashChange,
    ).toHaveBeenCalledTimes(1);
    expect(shellContext.shell.routing.onHashChange).toHaveBeenCalledTimes(1);

    rerender();
    expect(shellContext.shell.routing.onHashChange).toHaveBeenCalledTimes(2);
  });
});
