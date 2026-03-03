import {
  OkmsKeyTypes,
  OkmsServiceKey,
  OkmsServiceKeyState,
  OkmsServiceKeyWithData,
} from '@key-management-service/types/okmsServiceKey.type';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { useServiceKeyDownloadActions } from './useServiceKeyDownloadActions';

const {
  mockAddError,
  mockRefetchPem,
  mockRefetchJwk,
  mockInitiateTextFileDownload,
  mockUseOkmsServiceKeyById,
} = vi.hoisted(() => ({
  mockAddError: vi.fn(),
  mockRefetchPem: vi.fn(),
  mockRefetchJwk: vi.fn(),
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

vi.mock('@/common/utils/files/download', () => ({
  initiateTextFileDownload: mockInitiateTextFileDownload,
}));

describe('useServiceKeyDownloadActions', () => {
  const okmsId = 'test-okms-id';
  const keyId = 'test-key-id';

  const commonServiceKey: OkmsServiceKey = {
    id: keyId,
    name: 'TestKey',
    state: OkmsServiceKeyState.active,
    type: OkmsKeyTypes.RSA,
    iam: {
      id: 'iam-id',
      urn: 'urn:test',
      displayName: 'TestKey',
    },
    createdAt: '2023-01-01T00:00:00Z',
    operations: [],
  };
  const mockServiceKeyWithPemData: OkmsServiceKeyWithData = {
    ...commonServiceKey,
    keysPEM: [{ pem: '-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----' }],
  };
  const mockServiceKeyWithJwkData: OkmsServiceKeyWithData = {
    ...commonServiceKey,
    keys: [{ kty: 'RSA', n: 'test', e: 'AQAB' }],
  };

  const renderUseServiceKeyDownloadActions = async ({
    keyType,
    keyState,
    page,
  }: {
    keyType: OkmsKeyTypes;
    keyState: OkmsServiceKeyState;
    page: 'list' | 'detail';
  }) => {
    const wrapper = await testWrapperBuilder().withQueryClient().build();
    return renderHook(
      () =>
        useServiceKeyDownloadActions({
          okmsId,
          keyId,
          keyType,
          keyState,
          page,
        }),
      { wrapper },
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOkmsServiceKeyById.mockImplementation(({ format }: { format?: 'PEM' | 'JWK' }) => {
      if (format === 'PEM') {
        return { refetch: mockRefetchPem, isFetching: false };
      }
      if (format === 'JWK') {
        return { refetch: mockRefetchJwk, isFetching: false };
      }
      return { refetch: vi.fn(), isFetching: false };
    });
    mockRefetchPem.mockResolvedValue({
      data: mockServiceKeyWithPemData,
    });
    mockRefetchJwk.mockResolvedValue({
      data: mockServiceKeyWithJwkData,
    });
  });

  describe('when keyType is oct', () => {
    it('should return empty array', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.oct,
        keyState: OkmsServiceKeyState.active,
        page: 'list',
      });

      expect(result.current).toEqual([]);
    });
  });

  describe('when keyType is not oct', () => {
    it('should return two actions (PEM and JWK) with correct properties for active key', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.RSA,
        keyState: OkmsServiceKeyState.active,
        page: 'list',
      });

      expect(result.current).toHaveLength(2);
      expect(mockUseOkmsServiceKeyById).toHaveBeenNthCalledWith(1, {
        okmsId,
        keyId,
        format: 'PEM',
        enabled: false,
      });
      expect(mockUseOkmsServiceKeyById).toHaveBeenNthCalledWith(2, {
        okmsId,
        keyId,
        format: 'JWK',
        enabled: false,
      });

      expect(result.current[0]!).toMatchObject({
        buttonId: 'service-key-download_encryption_key_pem',
        label:
          'key-management-service/serviceKeys:key_management_service_service-keys_link_download_key_pem',
        color: 'primary',
      });
      expect(result.current[0]!.onClick).toBeInstanceOf(Function);

      expect(result.current[1]!).toMatchObject({
        buttonId: 'service-key-download_encryption_key_jwk',
        label:
          'key-management-service/serviceKeys:key_management_service_service-keys_link_download_key_jwk',
        color: 'primary',
      });
      expect(result.current[1]!.onClick).toBeInstanceOf(Function);
    });

    it('should return actions with isDisabled true when keyState is not active', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.RSA,
        keyState: OkmsServiceKeyState.deactivated,
        page: 'list',
      });

      expect(result.current[0]!.isDisabled).toBe(true);
      expect(result.current[1]!.isDisabled).toBe(true);
    });

    it('should return actions with isDisabled false when keyState is active', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.EC,
        keyState: OkmsServiceKeyState.active,
        page: 'detail',
      });

      expect(result.current[0]!.isDisabled).toBe(false);
      expect(result.current[1]!.isDisabled).toBe(false);
    });
  });

  describe('PEM onClick handler', () => {
    it('should call refetch when PEM onClick is triggered', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.RSA,
        keyState: OkmsServiceKeyState.active,
        page: 'list',
      });

      const onClick = result.current[0]!.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockRefetchPem).toHaveBeenCalledTimes(1);
      expect(mockRefetchJwk).not.toHaveBeenCalled();
    });

    it('should initiate PEM file download with correct filename and content', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.RSA,
        keyState: OkmsServiceKeyState.active,
        page: 'list',
      });

      const onClick = result.current[0]!.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockInitiateTextFileDownload).toHaveBeenCalledWith({
        filename: `${mockServiceKeyWithPemData.name}.pem`,
        text: '-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----',
      });
    });
  });

  describe('JWK onClick handler', () => {
    it('should show error notification when refetch returns no data', async () => {
      mockRefetchJwk.mockResolvedValue({
        data: undefined,
      });

      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.RSA,
        keyState: OkmsServiceKeyState.active,
        page: 'list',
      });

      const onClick = result.current[1]!.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockAddError).toHaveBeenCalledWith('common:error_fetching_data');
      expect(mockInitiateTextFileDownload).not.toHaveBeenCalled();
      expect(mockRefetchPem).not.toHaveBeenCalled();
    });

    it('should initiate JWK file download with correct filename and content', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.RSA,
        keyState: OkmsServiceKeyState.active,
        page: 'list',
      });

      const onClick = result.current[1]!.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockInitiateTextFileDownload).toHaveBeenCalledWith({
        filename: `${mockServiceKeyWithJwkData.name}.jwk`,
        text: JSON.stringify(mockServiceKeyWithJwkData.keys),
      });
    });

    it('should complete full flow: refetch, track, and download for JWK', async () => {
      const { result } = await renderUseServiceKeyDownloadActions({
        keyType: OkmsKeyTypes.EC,
        keyState: OkmsServiceKeyState.active,
        page: 'detail',
      });

      const onClick = result.current[1]!.onClick;
      if (onClick) {
        await Promise.resolve(onClick());
      }

      expect(mockRefetchJwk).toHaveBeenCalledTimes(1);
      expect(mockRefetchPem).not.toHaveBeenCalled();
      expect(mockInitiateTextFileDownload).toHaveBeenCalledTimes(1);
      expect(mockAddError).not.toHaveBeenCalled();
    });
  });
});
