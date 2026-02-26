import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedS3ObjectVersions } from '@/__tests__/helpers/mocks/s3/object';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import {
  mockedUsedNavigate,
  setMockedSearchParams,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedFormattedStorage } from '@/__tests__/helpers/mocks/storageContainer/storages';
import Versions from './Versions.page';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';

vi.mock('@/hooks/useLocale', async () => {
  const mod = await vi.importActual('@/hooks/useLocale');
  return {
    ...mod,
    useLocale: vi.fn(() => 'fr_FR'),
  };
});

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3ObjectVersions: vi.fn(() => [mockedS3ObjectVersions]),
  getS3: vi.fn(() => ({
    ...mockedFormattedStorage,
    region: 'BHS',
    name: 'storageName',
  })),
}));

describe('Versions List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'storageName',
    });
    setMockedSearchParams({ objectKey: 'objectKey' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the versions table', async () => {
    render(<Versions />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('versionsTitle')).toBeTruthy();
      expect(screen.getByText(mockedS3ObjectVersions.key)).toBeTruthy();
    });
  });

  it('Check actions buttons in version menu', async () => {
    render(<Versions />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedS3ObjectVersions.key)).toBeTruthy();
    });

    act(() => {
      const trigger = screen.getByTestId('object-versions-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('object-version-action-download-button'),
      ).toBeTruthy();
      expect(
        screen.getByTestId('object-version-action-delete-button'),
      ).toBeTruthy();
    });
  });
});
