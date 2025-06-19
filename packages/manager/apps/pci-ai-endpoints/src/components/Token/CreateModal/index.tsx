import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsModal,
  OsdsButton,
  OsdsMessage,
  OsdsText,
  OsdsClipboard,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TRACKING } from '@/configuration/tracking.constants';
import { TokenData } from '@/types/cloud/project/database/token/index';
import CreateForm from './CreateForm';

type CreateModalProps = {
  onClose: () => void;
  projectId: string;
  tokens: string[];
  infiniteDate: Date;
};

export default function CreateModal({
  onClose,
  projectId,
  tokens,
  infiniteDate,
}: CreateModalProps) {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('token');
  const [createdToken, setCreatedToken] = useState<TokenData | null>(null);

  const handleFormSuccess = (token: TokenData) => {
    setCreatedToken(token);
    trackClick(TRACKING.apikey.successCreatApikeyPopUpShown);
  };

  const modalHeadline = createdToken
    ? t('ai_endpoints_token_success')
    : t('ai_endpoints_token_creation');
  const actionLabel = createdToken
    ? t('ai_endpoints_token_understand')
    : t('ai_endpoints_token_create');

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={onClose}
      dismissible
      headline={modalHeadline}
    >
      {createdToken ? (
        <>
          <OsdsMessage
            type={ODS_MESSAGE_TYPE.info}
            className="my-8 max-w-[902px]"
          >
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('ai_endpoints_token_success_message')}
            </OsdsText>
          </OsdsMessage>
          <OsdsClipboard
            aria-label="clipboard"
            value={createdToken.token || ''}
          />
          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.flat}
            onClick={onClose}
            className="mt-4"
          >
            {actionLabel}
          </OsdsButton>
        </>
      ) : (
        <CreateForm
          projectId={projectId}
          tokens={tokens}
          infiniteDate={infiniteDate}
          onSuccess={handleFormSuccess}
        />
      )}
    </OsdsModal>
  );
}
