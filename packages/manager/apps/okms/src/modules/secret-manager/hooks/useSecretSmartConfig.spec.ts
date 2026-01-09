import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { mockSecret1, mockSecret2 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SecretSmartConfig, buildSecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REGION_EU_WEST_RBX } from '@/common/mocks/catalog/catalog.mock';
import { createErrorResponseMock } from '@/common/utils/tests/testUtils';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { UseSecretSmartConfigParams, useSecretSmartConfig } from './useSecretSmartConfig';

// Mock the useCurrentRegion hook
const mockUseCurrentRegion = vi.fn();
vi.mock('@secret-manager/hooks/useCurrentRegion', () => ({
  useCurrentRegion: (okmsList: OKMS[]): unknown => mockUseCurrentRegion(okmsList),
}));

// Mock the useOkmsById hook
const mockUseOkmsById = vi.fn();
vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsById: (okmsId: string): unknown => mockUseOkmsById(okmsId),
}));

// Mock the useOkmsSecretConfig hook
const mockUseOkmsSecretConfig = vi.fn();
vi.mock('@secret-manager/data/hooks/useSecretConfigOkms', () => ({
  useSecretConfigOkms: (okmsId: string): unknown => mockUseOkmsSecretConfig(okmsId),
}));

// Mock the useSecretConfigReference hook
const mockUseSecretConfigReference = vi.fn();
vi.mock('@secret-manager/data/hooks/useSecretConfigReference', () => ({
  useSecretConfigReference: (region: string): unknown => mockUseSecretConfigReference(region),
}));

// Mock the useNotifications hook from external library
const mockAddError = vi.fn();
vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    useNotifications: () => ({ addError: mockAddError }),
  };
});

// Mock the getSecretSmartConfig utility
vi.mock('@secret-manager/utils/secretSmartConfig', async () => {
  const actual = await vi.importActual('@secret-manager/utils/secretSmartConfig');
  return {
    ...actual,
    buildSecretSmartConfig: vi.fn(),
  };
});

const mockBuildSecretSmartConfig = vi.mocked(buildSecretSmartConfig);

// Mock data
const mockOkmsId = 'test-okms-id';
const mockSecretConfigOkms = {
  casRequired: true,
  deactivateVersionAfter: '2h',
  maxVersions: 15,
};
const mockSecretConfigReference = {
  casRequired: false,
  maxVersions: 20,
};
const mockSecretSmartConfig: SecretSmartConfig = {
  casRequired: {
    value: true,
    origin: 'DOMAIN',
  },
  deactivateVersionAfter: {
    value: '2h',
    origin: 'DOMAIN',
  },
  maxVersions: {
    value: 15,
    origin: 'DOMAIN',
  },
  isCasRequiredSetOnOkms: true,
  maxVersionsDefault: 10,
};

const renderTestHook = async (values: UseSecretSmartConfigParams) => {
  const wrapper = await testWrapperBuilder().withQueryClient().build();

  return renderHook(() => useSecretSmartConfig(values), { wrapper });
};

describe('useSecretSmartConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseOkmsById.mockReturnValue({
      data: okmsRoubaix1Mock,
      isPending: false,
      error: null,
    });
    mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_RBX);
    mockUseOkmsSecretConfig.mockReturnValue({
      data: mockSecretConfigOkms,
      isPending: false,
      error: null,
    });
    mockUseSecretConfigReference.mockReturnValue({
      data: mockSecretConfigReference,
      isPending: false,
      error: null,
    });
    mockBuildSecretSmartConfig.mockReturnValue(mockSecretSmartConfig);
    mockAddError.mockClear();
  });

  describe('when data is loading', () => {
    it('should return loading state when OKMS data is pending', async () => {
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });

    it('should return loading state when secret config OKMS is pending', async () => {
      mockUseOkmsSecretConfig.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });

    it('should return loading state when secret config reference is pending', async () => {
      mockUseSecretConfigReference.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });

    it('should return loading state when any data is pending', async () => {
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });
      mockUseOkmsSecretConfig.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });
      mockUseSecretConfigReference.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });
  });

  describe('when there are errors', () => {
    it('should return error state when OKMS data has error', async () => {
      const mockError = createErrorResponseMock('OKMS error');
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: false,
        error: mockError,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        error: mockError,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith('OKMS error');
    });

    it('should return error state when secret config OKMS has error', async () => {
      const mockError = createErrorResponseMock('Secret config OKMS error');
      mockUseOkmsSecretConfig.mockReturnValue({
        data: null,
        isPending: false,
        error: mockError,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        error: mockError,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith('Secret config OKMS error');
    });

    it('should return error state when secret config reference has error', async () => {
      const mockError = createErrorResponseMock('Secret config reference error');
      mockUseSecretConfigReference.mockReturnValue({
        data: null,
        isPending: false,
        error: mockError,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        error: mockError,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith('Secret config reference error');
    });

    it('should return error state when any data has error', async () => {
      const mockError = createErrorResponseMock('OKMS error');
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: false,
        error: mockError,
      });
      mockUseOkmsSecretConfig.mockReturnValue({
        data: null,
        isPending: false,
        error: mockError,
      });

      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        error: mockError,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith('OKMS error');
    });
  });

  describe('when data is loaded successfully', () => {
    it('should return secret smart config when all data is available', async () => {
      const { result } = await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(result.current).toEqual({
        isPending: false,
        isError: false,
        secretConfig: mockSecretSmartConfig,
      });

      expect(mockBuildSecretSmartConfig).toHaveBeenCalledWith(
        mockSecretConfigOkms,
        mockSecretConfigReference,
        mockSecret1,
      );
    });

    it('should call getSecretSmartConfig with correct parameters', async () => {
      await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret2 });

      expect(mockBuildSecretSmartConfig).toHaveBeenCalledWith(
        mockSecretConfigOkms,
        mockSecretConfigReference,
        mockSecret2,
      );
    });
  });

  describe('error notification', () => {
    it('should call addError with error message when there is an error', async () => {
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: false,
        error: createErrorResponseMock('Test error'),
      });

      await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(mockAddError).toHaveBeenCalledWith('Test error');
    });

    it('should not call addError when there is no error', async () => {
      await renderTestHook({ okmsId: mockOkmsId, secret: mockSecret1 });

      expect(mockAddError).not.toHaveBeenCalled();
    });
  });
});
