import {
  OkmsKeyTypes,
  OkmsServiceKeyState,
  OkmsServiceKeyWithData,
} from '@key-management-service/types/okmsServiceKey.type';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookWithClient } from '@/common/utils/tests/testUtils';

import { useServiceKeyDownload } from './useServiceKeyDownload';

const { mockAddError, mockRefetch, mockInitiateTextFileDownload, mockUseOkmsServiceKeyById } =
  vi.hoisted(() => ({
    mockAddError: vi.fn(),
    mockRefetch: vi.fn(),
    mockInitiateTextFileDownload: vi.fn(),
    mockUseOkmsServiceKeyById: vi.fn(),
  }));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key: string) => key),
  })),
}));

vi.mock('@ovh-ux/muk', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@ovh-ux/muk')>();

  return {
    ...mod,
    useNotifications: vi.fn(() => ({
      addError: mockAddError,
      addSuccess: vi.fn(),
      clearNotifications: vi.fn(),
    })),
  };
});

vi.mock('@key-management-service/data/hooks/useOkmsServiceKeys', () => ({
  useOkmsServiceKeyById: (...args: unknown[]) =>
    mockUseOkmsServiceKeyById(...args) as ReturnType<
      typeof import('@key-management-service/data/hooks/useOkmsServiceKeys').useOkmsServiceKeyById
    >,
}));

vi.mock('@/common/utils/dom/download', () => ({
  initiateTextFileDownload: mockInitiateTextFileDownload,
}));

describe('useServiceKeyDownload', () => {
  const okmsId = 'test-okms-id';
  const keyId = 'test-key-id';

  const mockServiceKeyWithData: OkmsServiceKeyWithData = {
    id: keyId,
    name: 'TestKey',
    state: OkmsServiceKeyState.active,
    type: OkmsKeyTypes.RSA,
    keys: [{ kty: 'RSA', n: 'test', e: 'AQAB' }],
    iam: {
      id: 'iam-id',
      urn: 'urn:test',
      displayName: 'TestKey',
    },
    createdAt: '2023-01-01T00:00:00Z',
    operations: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOkmsServiceKeyById.mockReturnValue({
      refetch: mockRefetch,
      isFetching: false,
    });
    mockRefetch.mockResolvedValue({
      data: mockServiceKeyWithData,
    });
  });

  describe('when keyType is oct', () => {
    it('should return undefined', () => {
      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.oct,
          keyState: OkmsServiceKeyState.active,
          page: 'list',
        }),
      );

      expect(result.current).toBeUndefined();
    });
  });

  describe('when keyType is not oct', () => {
    it('should return action with correct properties for active key', () => {
      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.RSA,
          keyState: OkmsServiceKeyState.active,
          page: 'list',
        }),
      );

      expect(result.current).toMatchObject({
        buttonId: 'service-key-download_encryption_key',
        label:
          'key-management-service/serviceKeys:key_management_service_service-keys_link_download_key',
        icon: 'download',
        color: 'primary',
      });
      expect(result.current?.onClick).toBeInstanceOf(Function);
    });

    it('should return action with isDisabled true when keyState is not active', () => {
      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.RSA,
          keyState: OkmsServiceKeyState.deactivated,
          page: 'list',
        }),
      );

      expect(result.current?.disabled).toBe(true);
    });

    it('should return action with isDisabled false when keyState is active', () => {
      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.EC,
          keyState: OkmsServiceKeyState.active,
          page: 'detail',
        }),
      );

      expect(result.current?.disabled).toBe(false);
    });
  });

  describe('onClick handler', () => {
    it('should call refetch when onClick is triggered', async () => {
      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.RSA,
          keyState: OkmsServiceKeyState.active,
          page: 'list',
        }),
      );

      const onClick = result.current?.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should show error notification when refetch returns no data', async () => {
      mockRefetch.mockResolvedValue({
        data: undefined,
      });

      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.RSA,
          keyState: OkmsServiceKeyState.active,
          page: 'list',
        }),
      );

      const onClick = result.current?.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockAddError).toHaveBeenCalledWith('common:error_fetching_data');
      expect(mockInitiateTextFileDownload).not.toHaveBeenCalled();
    });

    it('should initiate file download with correct filename and content', async () => {
      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.RSA,
          keyState: OkmsServiceKeyState.active,
          page: 'list',
        }),
      );

      const onClick = result.current?.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockInitiateTextFileDownload).toHaveBeenCalledWith({
        filename: `${mockServiceKeyWithData.name}.jwk`,
        text: JSON.stringify(mockServiceKeyWithData.keys),
      });
    });

    it('should complete full flow: refetch, track, and download', async () => {
      const { result } = renderHookWithClient(() =>
        useServiceKeyDownload({
          okmsId,
          keyId,
          keyType: OkmsKeyTypes.EC,
          keyState: OkmsServiceKeyState.active,
          page: 'detail',
        }),
      );

      const onClick = result.current?.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockRefetch).toHaveBeenCalledTimes(1);
      expect(mockInitiateTextFileDownload).toHaveBeenCalledTimes(1);
      expect(mockAddError).not.toHaveBeenCalled();
    });
  });
});
