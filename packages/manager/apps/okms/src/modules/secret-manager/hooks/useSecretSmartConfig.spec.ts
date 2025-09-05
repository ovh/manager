import { useParams } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  mockSecret1,
  mockSecret2,
} from '@secret-manager/mocks/secrets/secrets.mock';
import {
  SecretSmartConfig,
  buildSecretSmartConfig,
} from '@secret-manager/utils/secretSmartConfig';
import { okmsRoubaix1Mock } from '@/mocks/kms/okms.mock';
import { REGION_EU_WEST_RBX } from '@/mocks/catalog/catalog.mock';
import { useSecretSmartConfig } from './useSecretSmartConfig';
import {
  createErrorResponseMock,
  renderHookWithClient,
} from '@/utils/tests/testUtils';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

// Mock the useCurrentRegion hook
const mockUseCurrentRegion = vi.fn();
vi.mock('@secret-manager/hooks/useCurrentRegion', () => ({
  useCurrentRegion: (domains: unknown[]) => mockUseCurrentRegion(domains),
}));

// Mock the useOkmsById hook
const mockUseOkmsById = vi.fn();
vi.mock('@/data/hooks/useOkms', () => ({
  useOkmsById: (domainId: string) => mockUseOkmsById(domainId),
}));

// Mock the useOkmsSecretConfig hook
const mockUseOkmsSecretConfig = vi.fn();
vi.mock('@secret-manager/data/hooks/useSecretConfigOkms', () => ({
  useSecretConfigOkms: (domainId: string) => mockUseOkmsSecretConfig(domainId),
}));

// Mock the useSecretConfigReference hook
const mockUseSecretConfigReference = vi.fn();
vi.mock('@secret-manager/data/hooks/useSecretConfigReference', () => ({
  useSecretConfigReference: (region: string) =>
    mockUseSecretConfigReference(region),
}));

// Mock the useNotifications hook from external library
const mockAddError = vi.fn();
vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({ addError: mockAddError }),
}));

// Mock the getSecretSmartConfig utility
vi.mock('@secret-manager/utils/secretSmartConfig', async () => {
  const actual = await vi.importActual(
    '@secret-manager/utils/secretSmartConfig',
  );
  return {
    ...actual,
    buildSecretSmartConfig: vi.fn(),
  };
});

const mockUseParams = vi.mocked(useParams);
const mockBuildSecretSmartConfig = vi.mocked(buildSecretSmartConfig);

// Mock data
const mockDomainId = 'test-domain-id';
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
};

describe('useSecretSmartConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseParams.mockReturnValue({ domainId: mockDomainId });
    mockUseOkmsById.mockReturnValue({
      data: { data: okmsRoubaix1Mock },
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
    it('should return loading state when OKMS data is pending', () => {
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });

    it('should return loading state when secret config OKMS is pending', () => {
      mockUseOkmsSecretConfig.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });

    it('should return loading state when secret config reference is pending', () => {
      mockUseSecretConfigReference.mockReturnValue({
        data: null,
        isPending: true,
        error: null,
      });

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });

    it('should return loading state when any data is pending', () => {
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

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });
  });

  describe('when there are errors', () => {
    it('should return error state when OKMS data has error', () => {
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: false,
        error: createErrorResponseMock('OKMS error'),
      });

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith('OKMS error');
    });

    it('should return error state when secret config OKMS has error', () => {
      mockUseOkmsSecretConfig.mockReturnValue({
        data: null,
        isPending: false,
        error: createErrorResponseMock('Secret config OKMS error'),
      });

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith('Secret config OKMS error');
    });

    it('should return error state when secret config reference has error', () => {
      mockUseSecretConfigReference.mockReturnValue({
        data: null,
        isPending: false,
        error: createErrorResponseMock('Secret config reference error'),
      });

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith(
        'Secret config reference error',
      );
    });

    it('should return error state when any data has error', () => {
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: false,
        error: createErrorResponseMock('OKMS error'),
      });
      mockUseOkmsSecretConfig.mockReturnValue({
        data: null,
        isPending: false,
        error: createErrorResponseMock('Secret config error'),
      });

      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        secretConfig: undefined,
      });
      expect(mockAddError).toHaveBeenCalledWith('OKMS error');
    });
  });

  describe('when data is loaded successfully', () => {
    it('should return secret smart config when all data is available', () => {
      const { result } = renderHookWithClient(() =>
        useSecretSmartConfig(mockSecret1),
      );

      expect(result.current).toEqual({
        isPending: false,
        isError: false,
        secretConfig: mockSecretSmartConfig,
      });

      expect(mockBuildSecretSmartConfig).toHaveBeenCalledWith(
        mockSecret1,
        mockSecretConfigOkms,
        mockSecretConfigReference,
      );
    });

    it('should call getSecretSmartConfig with correct parameters', () => {
      renderHookWithClient(() => useSecretSmartConfig(mockSecret2));

      expect(mockBuildSecretSmartConfig).toHaveBeenCalledWith(
        mockSecret2,
        mockSecretConfigOkms,
        mockSecretConfigReference,
      );
    });
  });

  describe('error notification', () => {
    it('should call addError with error message when there is an error', () => {
      mockUseOkmsById.mockReturnValue({
        data: null,
        isPending: false,
        error: createErrorResponseMock('Test error'),
      });

      renderHookWithClient(() => useSecretSmartConfig(mockSecret1));

      expect(mockAddError).toHaveBeenCalledWith('Test error');
    });

    it('should not call addError when there is no error', () => {
      renderHookWithClient(() => useSecretSmartConfig(mockSecret1));

      expect(mockAddError).not.toHaveBeenCalled();
    });
  });
});
