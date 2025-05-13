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
import { ROUTES_URLS } from '@/routes/routes.constants';
import {
  OkmsAllServiceKeys,
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';
import { OKMS } from '@/types/okms.type';
import { kmsIamActions } from '@/utils/iam/iam.constants';

const useServiceKeyActionsList = (
  okms: OKMS,
  okmsKey?: OkmsAllServiceKeys,
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
    keyId: okmsKey?.id,
    onSuccess: () => {
      navigate(`/${okms.id}/${ROUTES_URLS.keys}`);
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
    keyId: okmsKey?.id,
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

  const items: ActionMenuItem[] = [
    okmsKey?.type !== OkmsKeyTypes.oct && {
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
    },

    okmsKey?.state === OkmsServiceKeyState.active && {
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
          ? navigate(`${ROUTES_URLS.serviceKeyDeactivate}/${okmsKey?.id}`)
          : navigate(
              `/${okms.id}/${ROUTES_URLS.keys}/${okmsKey?.id}/${ROUTES_URLS.serviceKeyDeactivate}`,
            );
      },
      iamActions: [
        kmsIamActions.serviceKeyUpdate,
        kmsIamActions.serviceKeyDeactivate,
      ],
      urn: okmsKey?.iam.urn,
    },

    [OkmsServiceKeyState.deactivated, OkmsServiceKeyState.compromised].includes(
      okmsKey?.state,
    ) && {
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
    },

    ![
      OkmsServiceKeyState.destroyed,
      OkmsServiceKeyState.destroyed_compromised,
    ].includes(okmsKey?.state) && {
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
    },
  ].filter(Boolean);

  return items;
};

export default useServiceKeyActionsList;
