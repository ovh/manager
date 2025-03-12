import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/data/datastore.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import AddGit from './AddGit.modal';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';
import { mockedGitWithRegion } from '@/__tests__/helpers/mocks/volume/datastore';

describe('AddGit modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [mockedGitWithRegion]),
      addDatastore: vi.fn(() => mockedGitWithRegion),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal skeleton while loading', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
  });

  it('open and close add git modal', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-git-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-git-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-git-modal')).not.toBeInTheDocument();
    });
  });

  it('renders addGit and display toast error', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    const errorMsg = {
      description: 'api error message',
      title: 'formGitToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.addDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-username-input'), {
        target: {
          value: 'git-username-input',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-password-input'), {
        target: {
          value: 'password',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addToken with basic auth and refresh getRegistries after added', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('git-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-username-input'), {
        target: {
          value: 'git-username-input',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-password-input'), {
        target: {
          value: 'password',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formGitToastSuccessTitle',
        description: 'formGitToastSuccessDescription',
      });
    });
  });

  it('renders addToken with sshkey and refresh getRegistries after added', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-git-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-ssh-key'));
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-public-key-input'), {
        target: {
          value: 'git-username-input',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-private-key-input'), {
        target: {
          value: 'password',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formGitToastSuccessTitle',
        description: 'formGitToastSuccessDescription',
      });
    });
  });
});
