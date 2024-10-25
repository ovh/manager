import { describe, expect, it, vi } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { renderHook } from '@testing-library/react';
import {
  OkmsAllServiceKeys,
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';
import useServiceKeyActionsList from './useServiceKeyActionsList';
import { OKMS } from '@/types/okms.type';

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
  const okms: OKMS = {
    iam: {
      displayName: 'kms-1',
      id: '1b4e7c8e-d1b8-4b46-a584-52c8b4b0225c',
      urn: `urn:v1:eu:resource:okms:1b4e7c8e-d1b8-4b46-a584-52c8b4b0225c`,
    },
    id: '7f3a82ac-a8d8-4c2a-ab0c-f6e86ddf6a7c',
    kmipEndpoint: 'eu-west-rbx.okms.ovh.net:1234',
    region: 'EU_WEST_RBX',
    restEndpoint: 'https://eu-west-rbx.okms.ovh.net',
    swaggerEndpoint: '"https://swagger-eu-west-rbx.okms.ovh.net',
  };

  const commonKeyProps: Omit<OkmsAllServiceKeys, 'type' | 'state'> = {
    id: 'testKeyId',
    name: 'testKeyName',
    keys: [],
    createdAt: '2023-01-01T00:00:00Z',
    operations: [],
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
        useServiceKeyActionsList(okms, okmsKey),
      );
      expect(result.current).toEqual(
        expect.arrayContaining(
          expectedActions.map((action) => expect.objectContaining(action)),
        ),
      );
    });
  });
});
