import {
  ActionMenuItem,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useDeleteOkmsServiceKey } from '@/data/hooks/useDeleteOkmsServiceKey';
import { useUpdateOkmsServiceKey } from '@/data/hooks/useUpdateOkmsServiceKey';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import {
  OkmsServiceKey,
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';
import { OKMS } from '@/types/okms.type';
import { kmsIamActions } from '@/utils/iam/iam.constants';

const useServiceKeyActionsList = (
  okms: OKMS,
  okmsKey: OkmsServiceKey,
  isListMode?: boolean,
) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { addSuccess, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const trackLocation = isListMode ? PageLocation.datagrid : PageLocation.page;

  const {
    deleteKmsServiceKey,
    isPending: deleteIsPending,
  } = useDeleteOkmsServiceKey({
    okmsId: okms.id,
    keyId: okmsKey.id,
    onSuccess: () => {
      navigate(KMS_ROUTES_URLS.serviceKeyListing(okms.id));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_encryption_key',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'delete_encryption_key',
      });
    },
  });

  const {
    updateKmsServiceKey,
    isPending: updateIsPending,
  } = useUpdateOkmsServiceKey({
    okmsId: okms.id,
    keyId: okmsKey.id,
    onSuccess: () => {
      clearNotifications();
      addSuccess(
        t('key_management_service_service-keys_reactivate_success'),
        true,
      );
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'reactivate_encryption_key',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'reactivate_encryption_key',
      });
    },
  });

  const items: ActionMenuItem[] = [];

  if (okmsKey?.type !== OkmsKeyTypes.oct) {
    items.push({
      id: 1,
      label: t('key_management_service_service-keys_link_download_key'),
      color: ODS_BUTTON_COLOR.primary,
      isDisabled: okmsKey?.state !== OkmsServiceKeyState.active,
      download: `${okmsKey?.name}.jwk`,
      href: `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(okmsKey?.keys),
      )}`,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['download_encryption_key'],
        });
      },
    });
  }

  if (okmsKey?.state === OkmsServiceKeyState.active) {
    items.push({
      id: 2,
      label: t('key_management_service_service-keys_link_deactivate_key'),
      color: ODS_BUTTON_COLOR.primary,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['deactivate_encryption_key'],
        });
        return isListMode
          ? navigate(
              KMS_ROUTES_URLS.serviceKeyListingDeactivate(okms.id, okmsKey?.id),
            )
          : navigate(
              KMS_ROUTES_URLS.serviceKeyDashboardDeactivate(
                okms.id,
                okmsKey?.id,
              ),
            );
      },
      iamActions: [
        kmsIamActions.serviceKeyUpdate,
        kmsIamActions.serviceKeyDeactivate,
      ],
      urn: okmsKey?.iam.urn,
    });
  }

  if (okmsKey?.state) {
    if (
      [
        OkmsServiceKeyState.deactivated,
        OkmsServiceKeyState.compromised,
      ].includes(okmsKey.state)
    ) {
      items.push({
        id: 3,
        label: t('key_management_service_service-keys_link_reactivate_key'),
        color: ODS_BUTTON_COLOR.primary,
        isLoading: updateIsPending,
        iamActions: [
          kmsIamActions.serviceKeyUpdate,
          kmsIamActions.serviceKeyActivate,
        ],
        urn: okmsKey?.iam.urn,
        onClick: () => {
          trackClick({
            location: trackLocation,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['reactivate_encryption_key'],
          });
          updateKmsServiceKey({ state: OkmsServiceKeyState.active });
        },
      });
    }

    if (
      ![
        OkmsServiceKeyState.destroyed,
        OkmsServiceKeyState.destroyed_compromised,
      ].includes(okmsKey.state)
    ) {
      items.push({
        id: 4,
        label: t('key_management_service_service-keys_link_delete_key'),
        color: ODS_BUTTON_COLOR.primary,
        isDisabled: okmsKey?.state === OkmsServiceKeyState.active,
        isLoading: deleteIsPending,
        iamActions: [kmsIamActions.serviceKeyDelete],
        urn: okmsKey?.iam.urn,
        onClick: () => {
          trackClick({
            location: trackLocation,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['delete_encryption_key'],
          });
          deleteKmsServiceKey();
        },
      });
    }
  }

  return items;
};

export default useServiceKeyActionsList;
