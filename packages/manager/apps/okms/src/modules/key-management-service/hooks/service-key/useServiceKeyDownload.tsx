import { useOkmsServiceKeyById } from '@key-management-service/data/hooks/useOkmsServiceKeys';
import {
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { useNotifications } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { initiateTextFileDownload } from '@/common/utils/dom/download';

import { ServiceKeyAction } from './service-key.type';

type ServiceKeyDownloadParams = {
  okmsId: string;
  keyId: string;
  keyType: OkmsKeyTypes;
  keyState: OkmsServiceKeyState;
  page: 'list' | 'detail';
};

export const useServiceKeyDownload = ({
  okmsId,
  keyId,
  keyType,
  keyState,
  page,
}: ServiceKeyDownloadParams): ServiceKeyAction | undefined => {
  const { t } = useTranslation(['key-management-service/serviceKeys', 'common']);
  const { addError } = useNotifications();
  const { trackClick } = useOkmsTracking();
  const { refetch, isFetching } = useOkmsServiceKeyById({ okmsId, keyId, enabled: false });

  // Oct keys are not downloadable
  if (keyType === OkmsKeyTypes.oct) {
    return undefined;
  }

  return {
    name: 'download_encryption_key',
    label: t(
      'key-management-service/serviceKeys:key_management_service_service-keys_link_download_key',
    ),
    isLoading: isFetching,
    isDisabled: keyState !== OkmsServiceKeyState.active,
    icon: ODS_ICON_NAME.download,
    color: ODS_BUTTON_COLOR.primary,
    onClick: async () => {
      const { data: key } = await refetch();
      if (!key) {
        addError(t('common:error_fetching_data'));
        return;
      }
      trackClick({
        location: page === 'list' ? PageLocation.datagrid : PageLocation.page,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['download', 'service-key'],
      });
      initiateTextFileDownload({
        filename: `${key.name}.jwk`,
        text: JSON.stringify(key.keys),
      });
    },
  };
};
