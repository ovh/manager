import { useNavigate } from 'react-router-dom';

import { useDeleteOkmsServiceKey } from '@key-management-service/data/hooks/useDeleteOkmsServiceKey';
import { useUpdateOkmsServiceKey } from '@key-management-service/data/hooks/useUpdateOkmsServiceKey';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import {
  OkmsServiceKey,
  OkmsServiceKeyState,
} from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { useNotifications } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { ServiceKeyAction } from './service-key.type';
import { useServiceKeyDownload } from './useServiceKeyDownload';

export const useServiceKeyActionsList = (
  okms: OKMS,
  okmsKey: OkmsServiceKey,
  page: 'list' | 'detail',
): ServiceKeyAction[] => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { addSuccess, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOkmsTracking();
  const trackLocation = page === 'list' ? PageLocation.datagrid : PageLocation.page;

  const downloadAction = useServiceKeyDownload({
    okmsId: okms.id,
    keyId: okmsKey.id,
    keyType: okmsKey.type,
    keyState: okmsKey.state,
    page: 'list',
  });

  const { deleteKmsServiceKey, isPending: deleteIsPending } = useDeleteOkmsServiceKey({
    okmsId: okms.id,
    keyId: okmsKey.id,
    onSuccess: () => {
      navigate(KMS_ROUTES_URLS.serviceKeyListing(okms.id));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['delete', 'service-key'],
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['delete', 'service-key'],
      });
    },
  });

  const { updateKmsServiceKey, isPending: updateIsPending } = useUpdateOkmsServiceKey({
    okmsId: okms.id,
    keyId: okmsKey.id,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('key_management_service_service-keys_reactivate_success'), true);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['activate', 'service-key'],
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['activate', 'service-key'],
      });
    },
  });

  const items: ServiceKeyAction[] = [];

  if (okmsKey.state === OkmsServiceKeyState.active) {
    items.push({
      name: 'deactivate_encryption_key',
      label: t('key_management_service_service-keys_link_deactivate_key'),
      color: ODS_BUTTON_COLOR.primary,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['deactivate', 'service-key'],
        });
        return page === 'list'
          ? navigate(KMS_ROUTES_URLS.serviceKeyListingDeactivate(okms.id, okmsKey?.id))
          : navigate(KMS_ROUTES_URLS.serviceKeyDashboardDeactivate(okms.id, okmsKey?.id));
      },
      iamActions: [kmsIamActions.serviceKeyUpdate, kmsIamActions.serviceKeyDeactivate],
      urn: okmsKey?.iam.urn,
      icon: ODS_ICON_NAME.lockClose,
    });
  }

  if ([OkmsServiceKeyState.deactivated, OkmsServiceKeyState.compromised].includes(okmsKey.state)) {
    items.push({
      name: 'reactivate_encryption_key',
      label: t('key_management_service_service-keys_link_reactivate_key'),
      color: ODS_BUTTON_COLOR.primary,
      isLoading: updateIsPending,
      iamActions: [kmsIamActions.serviceKeyUpdate, kmsIamActions.serviceKeyActivate],
      urn: okmsKey?.iam.urn,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['activate', 'service-key'],
        });
        updateKmsServiceKey({ state: OkmsServiceKeyState.active });
      },
      icon: ODS_ICON_NAME.refresh,
    });
  }

  if (
    ![OkmsServiceKeyState.destroyed, OkmsServiceKeyState.destroyed_compromised].includes(
      okmsKey.state,
    )
  ) {
    items.push({
      name: 'delete_encryption_key',
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
          actions: ['delete', 'service-key'],
        });
        deleteKmsServiceKey();
      },
      icon: ODS_ICON_NAME.trash,
    });
  }

  return downloadAction ? [downloadAction, ...items] : items;
};
