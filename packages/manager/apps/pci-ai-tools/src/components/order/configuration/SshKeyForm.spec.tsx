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
import { handleSelectText } from '@/__tests__/helpers/unitTestHelper';

describe('SSHKey Form component', () => {
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
      expect(screen.getByTestId('ssh-key-container')).toBeTruthy();
      expect(screen.getByTestId('ssh-key-select')).toBeTruthy();
      expect(screen.getByTestId('ssh-key-add-button')).toBeTruthy();
      expect(screen.getByTestId('ssh-key-configured')).toBeTruthy();
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
    await handleSelectText('select-sshKey-trigger', mockedSshKeyBis.name);
    act(() => {
      fireEvent.click(screen.getByTestId('ssh-key-add-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(screen.getByText(mockedSshKeyBis.name)).toBeTruthy();
      expect(screen.queryByText(mockedSshKey.name)).toBeNull();
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
      expect(screen.getByTestId('ssh-key-add-button')).toBeTruthy();
      expect(screen.getByTestId('ssh-key-remove-button-0')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('ssh-key-remove-button-0'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
