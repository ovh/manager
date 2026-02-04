import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Modal } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsClipboard,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { PERMANENT_TOKENS_TRACKING } from '@/tracking.constant';
import TokenSecretContext from '@/contexts/token-secret.context';

export default function PermanentTokensViewer() {
  const { t } = useTranslation(['permanent-tokens', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const { tokenSecret } = useContext(TokenSecretContext);

  const handleClose = () => {
    trackClick({
      actionType: 'action',
      actions: PERMANENT_TOKENS_TRACKING.VIEWER.CTA_CLOSE,
    });
    goBack();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      heading={t('iam_user_token_modal_add_success')}
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={handleClose}
      isOpen
    >
      <OdsFormField className="mb-6 mt-6">
        <label htmlFor="tokenSecretClipboard" slot="label">
          {t('iam_user_token_modal_view_token_secret_label')}
        </label>
        <OdsClipboard
          className="w-full"
          name="tokenSecretClipboard"
          value={tokenSecret}
          data-testid="tokenSecretClipboard"
        />
      </OdsFormField>
      <OdsMessage color={ODS_MODAL_COLOR.warning} isDismissible={false}>
        {t(
          'key_management_service_credential_create_confirmation_private-key_warn',
        )}
      </OdsMessage>
    </Modal>
  );
}
