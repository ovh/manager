import { useOkmsServiceKeyById } from '@key-management-service/data/hooks/useOkmsServiceKeys';
import {
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { initiateTextFileDownload } from '@/common/utils/files/download';

import { ServiceKeyAction } from './service-key.type';

type ServiceKeyDownloadParams = {
  okmsId: string;
  keyId: string;
  keyType: OkmsKeyTypes;
  keyState: OkmsServiceKeyState;
  page: 'list' | 'detail';
};

export const useServiceKeyDownloadActions = ({
  okmsId,
  keyId,
  keyType,
  keyState,
  page,
}: ServiceKeyDownloadParams): ServiceKeyAction[] => {
  const { t } = useTranslation(['key-management-service/serviceKeys', 'common']);
  const { addError } = useNotifications();
  const { trackClick } = useOkmsTracking();
  const { refetch: refetchPem, isFetching: isFetchingPem } = useOkmsServiceKeyById({
    okmsId,
    keyId,
    format: 'PEM',
    enabled: false,
  });
  const { refetch: refetchJwk, isFetching: isFetchingJwk } = useOkmsServiceKeyById({
    okmsId,
    keyId,
    format: 'JWK',
    enabled: false,
  });

  // Oct keys are not downloadable
  if (keyType === OkmsKeyTypes.oct) {
    return [];
  }

  const location = page === 'list' ? PageLocation.datagrid : PageLocation.page;
  const isDisabled = keyState !== OkmsServiceKeyState.active;

  const pemAction: ServiceKeyAction = {
    buttonId: 'service-key-download_encryption_key_pem',
    label: t(
      'key-management-service/serviceKeys:key_management_service_service-keys_link_download_key_pem',
    ),
    isLoading: isFetchingPem,
    isDisabled,
    color: BUTTON_COLOR.primary,
    onClick: async () => {
      const { data: key } = await refetchPem();
      const pemContent = key && 'keysPEM' in key ? key.keysPEM?.[0]?.pem : undefined;
      if (!key || !pemContent) {
        addError(t('common:error_fetching_data'));
        return;
      }
      trackClick({
        location,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['download', 'service-key', 'pem'],
      });
      initiateTextFileDownload({
        filename: `${key.name}.pem`,
        text: pemContent,
      });
    },
  };

  const jwkAction: ServiceKeyAction = {
    buttonId: 'service-key-download_encryption_key_jwk',
    label: t(
      'key-management-service/serviceKeys:key_management_service_service-keys_link_download_key_jwk',
    ),
    isLoading: isFetchingJwk,
    isDisabled,
    color: BUTTON_COLOR.primary,
    onClick: async () => {
      const { data: key } = await refetchJwk();
      const jwkContent = key && 'keys' in key ? key.keys : undefined;
      if (!key || !jwkContent) {
        addError(t('common:error_fetching_data'));
        return;
      }
      trackClick({
        location,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['download', 'service-key', 'jwk'],
      });
      initiateTextFileDownload({
        filename: `${key.name}.jwk`,
        text: JSON.stringify(jwkContent),
      });
    },
  };

  return [pemAction, jwkAction];
};
