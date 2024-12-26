import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import SshKeyForm from './SshKeyForm.component';
import {
  mockedOrderSshKey,
  mockedSshKey,
  mockedSshKeyBis,
} from '@/__tests__/helpers/mocks/sshkey';

describe('SSHKey Form component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  vi.mock('@/components/ui/use-toast', () => {
    const toastMock = vi.fn();
    return {
      useToast: vi.fn(() => ({
        toast: toastMock,
      })),
    };
  });

  const onChange = vi.fn();
  it('should display the Sshkey Form', async () => {
    render(
      <SshKeyForm
        configuredSshKeys={[mockedSshKey]}
        sshKeyList={[]}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ssh-key-container')).toBeInTheDocument();
      expect(screen.getByTestId('ssh-key-select')).toBeInTheDocument();
      expect(screen.getByTestId('ssh-key-add-button')).toBeInTheDocument();
      expect(screen.getByTestId('ssh-key-configured')).toBeInTheDocument();
    });
  });

  it('should add sshkey', async () => {
    render(
      <SshKeyForm
        configuredSshKeys={[mockedSshKey, mockedSshKeyBis]}
        sshKeyList={[]}
        onChange={onChange}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-sshKey-trigger')).toBeInTheDocument();
    });
    const triggerSelect = screen.getByTestId('select-sshKey-trigger');

    // Open select
    act(() => {
      fireEvent.focus(triggerSelect);
      fireEvent.keyDown(triggerSelect, { key: 'Enter', code: 13 });
    });

    // Check if select has the options
    await waitFor(() => {
      expect(triggerSelect).not.toHaveAttribute('data-state', 'closed');

      const optionToSelect = screen.getByText(mockedSshKeyBis.name);
      fireEvent.keyDown(optionToSelect, { key: 'Enter', code: 13 });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('ssh-key-add-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(screen.getByText(mockedSshKeyBis.name)).toBeInTheDocument();
      expect(screen.queryByText(mockedSshKey.name)).not.toBeInTheDocument();
    });
  });

  it('should remove ssh Form', async () => {
    render(
      <SshKeyForm
        configuredSshKeys={[mockedSshKey]}
        sshKeyList={[mockedOrderSshKey]}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ssh-key-add-button')).toBeInTheDocument();
      expect(screen.getByTestId('ssh-key-remove-button-0')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('ssh-key-remove-button-0'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
