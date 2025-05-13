import { describe, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { PrivateNetworkButton } from './PrivateNetworkButton.component';

const shellContext = {
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked_url'),
    },
  },
};

const wrapper = ({ children }) => (
  <ShellContext.Provider value={(shellContext as unknown) as ShellContextType}>
    {children}
  </ShellContext.Provider>
);

describe('PrivateNetworkButton', () => {
  it('renders without crashing', ({ expect }) => {
    const { getByTestId } = render(<PrivateNetworkButton projectId="test" />, {
      wrapper,
    });
    const button = getByTestId('privateNetworkButton-link');
    expect(button).toBeInTheDocument();
  });

  it('navigates to correct URL on click', async ({ expect }) => {
    const { getByTestId } = render(<PrivateNetworkButton projectId="test" />, {
      wrapper,
    });
    const button = getByTestId('privateNetworkButton-link');

    act(() => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(shellContext.shell.navigation.getURL).toHaveBeenCalledWith(
        'public-cloud',
        '#/pci/projects/test/private-networks',
        {},
      );
    });
  });
});
