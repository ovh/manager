import { describe, expect, it, vi } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { renderHook } from '@testing-library/react';
import { OkmsKeyTypes, OkmsServiceKeyState } from '@/types/okmsServiceKey.type';
import useServiceKeyActionsList from './useServiceKeyActionsList';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({ t: vi.fn((key) => key) })),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: vi.fn(() => ({ addSuccess: vi.fn() })),
}));

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
  const okmsId = 'testOkmsId';
  const commonKeyProps = {
    id: 'testKeyId',
    name: 'testKeyName',
    keys: [] as any[],
    createdAt: '2023-01-01T00:00:00Z',
    operations: [] as any[],
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
        useServiceKeyActionsList(okmsId, okmsKey),
      );
      expect(result.current).toEqual(
        expect.arrayContaining(
          expectedActions.map((action) => expect.objectContaining(action)),
        ),
      );
    });
  });
});
