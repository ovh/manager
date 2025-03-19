import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import * as sshkeyApi from '@/data/api/sshkey/sshkey.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import {
  mockedSshKey,
  mockedSshKeyBis,
} from '@/__tests__/helpers/mocks/sshkey';
import AddSSHKey from './AddSSHKey.modal';

describe('Add SSHKey modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/sshkey/sshkey.api', () => ({
      getSshkey: vi.fn(() => [mockedSshKey, mockedSshKeyBis]),
      addSSHKey: vi.fn((sshDetail) => sshDetail),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<AddSSHKey />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-sshKey-modal')).toBeInTheDocument();
    });
  });

  it('should add a SSH Key on submit', async () => {
    render(<AddSSHKey />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('ssh-key-name-field-label'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('ssh-key-value-input-field'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('ssh-key-input-field'), {
        target: {
          value: 'myNewSshKey',
        },
      });
      fireEvent.change(screen.getByTestId('ssh-key-value-input-field'), {
        target: {
          value: 'ssh-rsa AAAAB3',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-ssh-key-submit-button'));
    });
    await waitFor(() => {
      expect(sshkeyApi.addSSHKey).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formConnectionPoolToastSuccessTitle',
        description: 'addSshKeySuccessDescription',
      });
    });
  });

  it('should call useToast with error when API fails', async () => {
    vi.mocked(sshkeyApi.addSSHKey).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<AddSSHKey />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.change(screen.getByTestId('ssh-key-input-field'), {
        target: {
          value: 'myNewSshKey',
        },
      });
      fireEvent.change(screen.getByTestId('ssh-key-value-input-field'), {
        target: {
          value: 'ssh-rsa AAAAB3',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-ssh-key-submit-button'));
    });
    await waitFor(() => {
      expect(sshkeyApi.addSSHKey).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addSshKeyToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
