import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import * as userAPI from '@/data/api/user/user.api';
import { readJsonFile } from '@/lib/fileReader';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import ImportPolicyModal from './ImportPolicy.modal';

let mockedPolicies: File[] = [];

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
}));

vi.mock('@/data/api/user/user.api', () => ({
  addUserPolicy: vi.fn(),
}));

vi.mock('@/lib/fileReader', () => ({
  readJsonFile: vi.fn(),
}));

describe('ImportPolicy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      userId: String(mockedCloudUser.id),
    });
    mockedPolicies = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders ImportPolicy Modal', async () => {
    render(<ImportPolicyModal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('import-policy-modal')).toBeTruthy();
    expect(screen.getByTestId('import-policy-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(readJsonFile).mockResolvedValue({ Statement: [] });
    vi.mocked(userAPI.addUserPolicy).mockImplementation(() => {
      throw mockedObjStoError;
    });

    render(<ImportPolicyModal />, { wrapper: RouterWithQueryClientWrapper });

    const file = new File([JSON.stringify({ Statement: [] })], 'policy.json', {
      type: 'application/json',
    });

    act(() => {
      fireEvent.change(screen.getByTestId('import-policy-file-input'), {
        target: { files: [file] },
      });
    });

    act(() => {
      fireEvent.click(screen.getByText('fileUploaderButtonConfirm'));
    });

    await waitFor(() => {
      expect(userAPI.addUserPolicy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userPolicyToastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    vi.mocked(readJsonFile).mockResolvedValue({ Statement: [] });

    render(<ImportPolicyModal />, { wrapper: RouterWithQueryClientWrapper });

    const file = new File([JSON.stringify({ Statement: [] })], 'policy.json', {
      type: 'application/json',
    });

    act(() => {
      fireEvent.change(screen.getByTestId('import-policy-file-input'), {
        target: { files: [file] },
      });
    });

    act(() => {
      fireEvent.click(screen.getByText('fileUploaderButtonConfirm'));
    });

    await waitFor(() => {
      expect(userAPI.addUserPolicy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userPolicySuccessTitle',
        description: 'userPolicyToastSuccessDescription',
      });
    });
  });

  it('trigger JSON error toast when file cannot be read', async () => {
    vi.mocked(readJsonFile).mockRejectedValueOnce(new Error('bad json'));

    render(<ImportPolicyModal />, { wrapper: RouterWithQueryClientWrapper });

    const file = new File(['{bad json}'], 'policy.json', {
      type: 'application/json',
    });

    act(() => {
      fireEvent.change(screen.getByTestId('import-policy-file-input'), {
        target: { files: [file] },
      });
    });

    act(() => {
      fireEvent.click(screen.getByText('fileUploaderButtonConfirm'));
    });

    await waitFor(() => {
      expect(userAPI.addUserPolicy).not.toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userPolicyToastErrorTitle',
        variant: 'critical',
        description: 'userPolicyJSONToastError',
      });
    });
  });
});
