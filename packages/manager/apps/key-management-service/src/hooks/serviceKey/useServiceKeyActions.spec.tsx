import { describe, expect, it, vi } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { renderHook } from '@testing-library/react';
import {
  OkmsAllServiceKeys,
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';
import useServiceKeyActionsList from './useServiceKeyActionsList';
import { okmsMock } from '@/mocks/kms/okms.mock';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({ t: vi.fn((key) => key) })),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();

  return {
    ...mod,
    useNotifications: vi.fn().mockReturnValue({
      addError: vi.fn(),
      addSuccess: vi.fn(),
    }),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock('@/data/hooks/useDeleteOkmsServiceKey', () => ({
  useDeleteOkmsServiceKey: vi.fn(() => ({
    deleteKmsServiceKey: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@/data/hooks/useUpdateOkmsServiceKey', () => ({
  useUpdateOkmsServiceKey: vi.fn(() => ({
    updateKmsServiceKey: vi.fn(),
    isPending: false,
  })),
}));

describe('useServiceKeyActionsList', () => {
  const commonKeyProps: Omit<OkmsAllServiceKeys, 'type' | 'state'> = {
    id: 'testKeyId',
    name: 'testKeyName',
    keys: [],
    createdAt: '2023-01-01T00:00:00Z',
    operations: [],
    iam: {
      id: '8f8a75b0-3bde-4b8d-a8c0-928basvced',
      urn:
        'urn:v1:eu:resource:okms:8f8a75b0-b57d-45fc-8d4f-256664DFE/serviceKey/dqd63-5688-409c-234-125e24538f34',
      displayName: 'ServiceKeyTest',
    },
  };

  const useCases = [
    {
      description: 'when key is not oct and is active',
      okmsKey: {
        ...commonKeyProps,
        type: OkmsKeyTypes.RSA,
        state: OkmsServiceKeyState.active,
      },
      expectedActions: [
        {
          id: 1,
          label: 'key_management_service_service-keys_link_download_key',
          color: ODS_THEME_COLOR_INTENT.primary,
          disabled: false,
          href: `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify([]),
          )}`,
          download: 'testKeyName.jwk',
        },
        {
          id: 2,
          label: 'key_management_service_service-keys_link_deactivate_key',
          color: ODS_THEME_COLOR_INTENT.primary,
        },
        {
          id: 4,
          label: 'key_management_service_service-keys_link_delete_key',
          color: ODS_THEME_COLOR_INTENT.error,
          disabled: true,
        },
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
        {
          id: 1,
          label: 'key_management_service_service-keys_link_download_key',
          color: ODS_THEME_COLOR_INTENT.primary,
          disabled: true,
          href: `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify([]),
          )}`,
          download: 'testKeyName.jwk',
        },
        {
          id: 3,
          label: 'key_management_service_service-keys_link_reactivate_key',
          color: ODS_THEME_COLOR_INTENT.primary,
          disabled: false,
        },
        {
          id: 4,
          label: 'key_management_service_service-keys_link_delete_key',
          color: ODS_THEME_COLOR_INTENT.error,
          disabled: false,
        },
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
        {
          id: 1,
          label: 'key_management_service_service-keys_link_download_key',
          color: ODS_THEME_COLOR_INTENT.primary,
          disabled: true,
          href: `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify([]),
          )}`,
          download: 'testKeyName.jwk',
        },
        {
          id: 3,
          label: 'key_management_service_service-keys_link_reactivate_key',
          color: ODS_THEME_COLOR_INTENT.primary,
          disabled: false,
        },
        {
          id: 4,
          label: 'key_management_service_service-keys_link_delete_key',
          color: ODS_THEME_COLOR_INTENT.error,
          disabled: false,
        },
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
        {
          id: 2,
          label: 'key_management_service_service-keys_link_deactivate_key',
          color: ODS_THEME_COLOR_INTENT.primary,
        },
        {
          id: 4,
          label: 'key_management_service_service-keys_link_delete_key',
          color: ODS_THEME_COLOR_INTENT.error,
          disabled: true,
        },
      ],
    },
  ];

  useCases.forEach(({ description, okmsKey, expectedActions }) => {
    it(description, () => {
      const { result } = renderHook(() =>
        useServiceKeyActionsList(okmsMock[0], okmsKey),
      );
      expect(result.current).toEqual(
        expect.arrayContaining(
          expectedActions.map((action) => expect.objectContaining(action)),
        ),
      );
    });
  });
});
