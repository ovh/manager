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
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import Service, { breadcrumb as Breadcrumb } from './Create.page';
import {
  mocked3AZRegion,
  mockedGRARegion,
  mockedLZRegion,
  mockedRegion,
} from '@/__tests__/helpers/mocks/region/region';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';
import { mockedAvailability } from '@/__tests__/helpers/mocks/availability/availability';
import * as s3Api from '@/data/api/storage/s3Storage.api';
import * as swiftApi from '@/data/api/storage/swiftStorage.api';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedSwiftContainer } from '@/__tests__/helpers/mocks/swift/swift';

vi.mock('react-i18next', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-i18next')>();
  return {
    ...mod,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

vi.mock('@/data/hooks/project/usePciProject.hook', () => ({
  default: () => ({
    data: { project_id: 'projectId' },
  }),
}));

describe('Create.page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId' });
    mockManagerReactShellClient();

    vi.mock('@/data/api/region/region.api', () => ({
      getRegions: vi.fn(() => [
        mocked3AZRegion,
        mockedRegion,
        mockedLZRegion,
        mockedGRARegion,
      ]),
    }));

    vi.mock('@/data/api/user/user.api', () => ({
      getUsers: vi.fn(() => [mockedCloudUser]),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/availability/availability.api', () => ({
      getProductAvailability: vi.fn(() => mockedAvailability),
    }));

    vi.mock('@/data/api/storage/s3Storage.api', () => ({
      createS3Storage: vi.fn(() => mockedStorageContainer),
    }));

    vi.mock('@/data/api/storage/swiftStorage.api', () => ({
      createSwiftStorage: vi.fn(() => mockedSwiftContainer),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders skeleton while loading', async () => {
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('order-funnel-skeleton')).toBeTruthy();
  });

  it('renders order funnel with common field', async () => {
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
      expect(screen.getByTestId('name-input')).toBeTruthy();
      expect(screen.getByTestId('offer-select-container')).toBeTruthy();
      expect(screen.getByTestId('regions-select-container')).toBeTruthy();
    });
  });

  /* Order S3 with 3AZ */
  it('Order S3 3AZ and trigger error on submit button click', async () => {
    vi.mocked(s3Api.createS3Storage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
      expect(screen.getByTestId('replication-step-container')).toBeTruthy();
      expect(screen.getByTestId('versioning-select-container')).toBeTruthy();
      expect(screen.getByTestId('object-lock-select-container')).toBeTruthy();
      expect(screen.getByTestId('user-step-container')).toBeTruthy();
      expect(screen.getByTestId('encrypt-select-container')).toBeTruthy();

      // only available in swift offer
      expect(screen.queryByTestId('swift-type-container')).toBeFalsy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });

    await waitFor(() => {
      expect(s3Api.createS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'createContainerErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('Order S3 3AZ and trigger on Success on submit button click', async () => {
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.change(screen.getByTestId('name-input'), {
        target: { value: 'my-new-s3' },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('offsite-replication-enabled-option'));
    });

    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });

    await waitFor(() => {
      expect(s3Api.createS3Storage).toHaveBeenCalledWith({
        data: {
          encryption: {
            sseAlgorithm: 'AES256',
          },
          name: 'my-new-s3',
          objectLock: {
            status: 'disabled',
          },
          ownerId: 12,
          replication: {
            rules: [
              {
                deleteMarkerReplication: 'enabled',
                destination: {
                  name: '',
                  region: 'BHS',
                },
                id: '',
                priority: 1,
                status: 'enabled',
              },
            ],
          },
          versioning: {
            status: 'enabled',
          },
        },
        projectId: 'projectId',
        region: 'EU-WEST-PAR',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `../s3/BHS/containerName`,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'createContainerSuccessTitle',
      });
    });
  });

  it('Order S3 3AZ and trigger object lock acknowledgement error on submit button click', async () => {
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('object-lock-enabled-option'));
    });

    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });

    await waitFor(() => {
      expect(
        screen.getByText('objectLockAcknowledgementRequired'),
      ).toBeTruthy();
      expect(s3Api.createS3Storage).not.toHaveBeenCalled();
    });
  });

  it('Order S3 LZ and trigger on Success on submit button click', async () => {
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.change(screen.getByTestId('name-input'), {
        target: { value: 'my-new-s3-lz' },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('regions-radio-tile-localzone'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('regions-radio-tile-RBX')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('regions-radio-tile-RBX'));
    });

    await waitFor(() => {
      // options are not available for LZ
      expect(screen.queryByTestId('replication-step-container')).toBeFalsy();
      expect(screen.queryByTestId('versioning-select-container')).toBeFalsy();
      expect(screen.queryByTestId('object-lock-select-container')).toBeFalsy();
      expect(screen.queryByTestId('user-step-container')).toBeFalsy();
      expect(screen.queryByTestId('encrypt-select-container')).toBeFalsy();

      // only available in swift offer
      expect(screen.queryByTestId('swift-type-container')).toBeFalsy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });

    await waitFor(() => {
      expect(s3Api.createS3Storage).toHaveBeenCalledWith({
        data: {
          name: 'my-new-s3-lz',
        },
        projectId: 'projectId',
        region: 'RBX',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `../s3/BHS/containerName`,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'createContainerSuccessTitle',
      });
    });
  });

  it('Order Swift and trigger on Error on submit button click', async () => {
    vi.mocked(swiftApi.createSwiftStorage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.change(screen.getByTestId('name-input'), {
        target: { value: 'my-new-swift' },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('offer-radio-tile-storage'));
    });

    await waitFor(() => {
      // options are not available for Swift
      expect(screen.queryByTestId('replication-step-container')).toBeFalsy();
      expect(screen.queryByTestId('versioning-select-container')).toBeFalsy();
      expect(screen.queryByTestId('object-lock-select-container')).toBeFalsy();
      expect(screen.queryByTestId('user-step-container')).toBeFalsy();
      expect(screen.queryByTestId('encrypt-select-container')).toBeFalsy();

      // only available in swift offer
      expect(screen.getByTestId('swift-type-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });

    await waitFor(() => {
      expect(swiftApi.createSwiftStorage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'createContainerErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('Order Swift and trigger on Success on submit button click', async () => {
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.change(screen.getByTestId('name-input'), {
        target: { value: 'my-new-swift' },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('offer-radio-tile-storage'));
    });

    act(() => {
      fireEvent.click(screen.getByTestId('swift-type-radio-tile-private'));
    });

    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });

    await waitFor(() => {
      expect(swiftApi.createSwiftStorage).toHaveBeenCalledWith({
        container: {
          archive: false,
          containerName: 'my-new-swift',
          region: 'GRA',
        },
        containerType: 'private',
        projectId: 'projectId',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith(`../swift/swift-id`);
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'createContainerSuccessTitle',
      });
    });
  });
});
