import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import {
  OkmsKeyTypes,
  OkmsServiceKey,
  OkmsServiceKeyState,
} from '@key-management-service/types/okmsServiceKey.type';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BUTTON_COLOR } from '@ovhcloud/ods-react';

import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { ServiceKeyAction } from './service-key.type';
import { useServiceKeyActionsList } from './useServiceKeyActionsList';
import { useServiceKeyDownloadActions } from './useServiceKeyDownloadActions';

const okmsItemMock = okmsRoubaix1Mock;
const mockedDownloadAction: ServiceKeyAction = {
  buttonId: 'service-key-download_encryption_key_pem',
  label: 'mocked-download-action-label',
  color: BUTTON_COLOR.primary,
  isDisabled: false,
  onClick: vi.fn(),
};

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({ t: vi.fn((key: string) => key) })),
}));

vi.mock('@ovh-ux/muk', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@ovh-ux/muk')>();

  return {
    ...mod,
    useNotifications: vi.fn().mockReturnValue({
      addError: vi.fn(),
      addSuccess: vi.fn(),
      clearNotifications: vi.fn(),
    }),
  };
});

vi.mock('@key-management-service/data/hooks/useDeleteOkmsServiceKey', () => ({
  useDeleteOkmsServiceKey: vi.fn(() => ({
    deleteKmsServiceKey: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@key-management-service/data/hooks/useUpdateOkmsServiceKey', () => ({
  useUpdateOkmsServiceKey: vi.fn(() => ({
    updateKmsServiceKey: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('./useServiceKeyDownloadActions', () => ({
  useServiceKeyDownloadActions: vi.fn(),
}));

describe('useServiceKeyActionsList', () => {
  const commonKeyProps: Omit<OkmsServiceKey, 'type' | 'state'> = {
    id: 'testKeyId',
    name: 'testKeyName',
    createdAt: '2023-01-01T00:00:00Z',
    operations: [],
    iam: {
      id: '8f8a75b0-3bde-4b8d-a8c0-928basvced',
      urn: 'urn:v1:eu:resource:okms:8f8a75b0-b57d-45fc-8d4f-256664DFE/serviceKey/dqd63-5688-409c-234-125e24538f34',
      displayName: 'ServiceKeyTest',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useServiceKeyDownloadActions).mockReturnValue([mockedDownloadAction]);
  });

  const useCases = [
    {
      description: 'when key is not oct and is active',
      okmsKey: {
        ...commonKeyProps,
        type: OkmsKeyTypes.RSA,
        state: OkmsServiceKeyState.active,
      },
      expectedActions: [
        // Shows deactivate action.
        {
          buttonId: 'service-key-deactivate_encryption_key',
          label: 'key_management_service_service-keys_link_deactivate_key',
          color: BUTTON_COLOR.primary,
        } satisfies Partial<ServiceKeyAction>,
        // Delete stays disabled.
        {
          buttonId: 'service-key-delete_encryption_key',
          label: 'key_management_service_service-keys_link_delete_key',
          color: BUTTON_COLOR.primary,
          isDisabled: true,
        } satisfies Partial<ServiceKeyAction>,
      ],
    },
    {
      description: 'when key is deactivated',
      okmsKey: {
        ...commonKeyProps,
        type: OkmsKeyTypes.RSA,
        state: OkmsServiceKeyState.deactivated,
      },
      expectedActions: [
        // Shows reactivate action.
        {
          buttonId: 'service-key-reactivate_encryption_key',
          label: 'key_management_service_service-keys_link_reactivate_key',
          color: BUTTON_COLOR.primary,
        } satisfies Partial<ServiceKeyAction>,
        // Delete is enabled.
        {
          buttonId: 'service-key-delete_encryption_key',
          label: 'key_management_service_service-keys_link_delete_key',
          color: BUTTON_COLOR.primary,
          isDisabled: false,
        } satisfies Partial<ServiceKeyAction>,
      ],
    },
    {
      description: 'when key is compromised',
      okmsKey: {
        ...commonKeyProps,
        type: OkmsKeyTypes.RSA,
        state: OkmsServiceKeyState.compromised,
      },
      expectedActions: [
        // Shows reactivate action.
        {
          buttonId: 'service-key-reactivate_encryption_key',
          label: 'key_management_service_service-keys_link_reactivate_key',
          color: BUTTON_COLOR.primary,
        } satisfies Partial<ServiceKeyAction>,
        // Delete is enabled.
        {
          buttonId: 'service-key-delete_encryption_key',
          label: 'key_management_service_service-keys_link_delete_key',
          color: BUTTON_COLOR.primary,
          isDisabled: false,
        } satisfies Partial<ServiceKeyAction>,
      ],
    },
    {
      description: 'when key is destroyed or destroyed_compromised',
      okmsKey: {
        ...commonKeyProps,
        type: OkmsKeyTypes.RSA,
        state: OkmsServiceKeyState.destroyed,
      },
      expectedActions: [],
    },
    {
      description: 'when key is oct',
      okmsKey: {
        ...commonKeyProps,
        type: OkmsKeyTypes.oct,
        state: OkmsServiceKeyState.active,
      },
      expectedActions: [
        // Shows deactivate action.
        {
          buttonId: 'service-key-deactivate_encryption_key',
          label: 'key_management_service_service-keys_link_deactivate_key',
          color: BUTTON_COLOR.primary,
        } satisfies Partial<ServiceKeyAction>,
        // Delete stays disabled.
        {
          buttonId: 'service-key-delete_encryption_key',
          label: 'key_management_service_service-keys_link_delete_key',
          color: BUTTON_COLOR.primary,
          isDisabled: true,
        } satisfies Partial<ServiceKeyAction>,
      ],
    },
  ];

  useCases.forEach(({ description, okmsKey, expectedActions }) => {
    it(description, async () => {
      const wrapper = await testWrapperBuilder().withRouterContext().build();
      const { result } = renderHook(() => useServiceKeyActionsList(okmsItemMock, okmsKey, 'list'), {
        wrapper,
      });

      expect(useServiceKeyDownloadActions).toHaveBeenCalledWith({
        okmsId: okmsItemMock.id,
        keyId: okmsKey.id,
        keyType: okmsKey.type,
        keyState: okmsKey.state,
        page: 'list',
      });

      expect(result.current).toEqual(
        expect.arrayContaining(
          [mockedDownloadAction, ...expectedActions].map(
            (action) => expect.objectContaining(action) as unknown,
          ),
        ),
      );
    });
  });
});
