import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { PERMANENT_TOKENS_TRACKING } from '@/tracking.constant';
import { useParam } from '@/hooks/useParam';
import { useDeleteIamUserToken } from '@/data/hooks/useGetIamUserTokens';

export default function PermanentTokensDelete() {
  const { t } = useTranslation(['permanent-tokens', NAMESPACES.ACTIONS]);
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const userId = useParam('userId');
  const { tokenId } = useParams();

  const { deleteToken, isPending } = useDeleteIamUserToken({
    userId,
    token: tokenId || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PERMANENT_TOKENS_TRACKING.DELETE.REQUEST_SUCCESS,
      });
      addSuccess(t('iam_user_token_modal_delete_success'));
      goBack();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PERMANENT_TOKENS_TRACKING.DELETE.REQUEST_FAIL,
      });
      addError(t('iam_user_token_modal_remove_error'));
      goBack();
    },
  });

  const handleSubmit = () => {
    trackClick({
      actionType: 'action',
      actions: PERMANENT_TOKENS_TRACKING.DELETE.CTA_CONFIRM,
    });
    deleteToken();
  };

  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: PERMANENT_TOKENS_TRACKING.DELETE.CTA_CANCEL,
    });
    goBack();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.critical}
      heading={t('iam_user_token_modal_title_delete', { tokenName: tokenId })}
      primaryLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={handleSubmit}
      isPrimaryButtonDisabled={isPending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={handleCancel}
      onDismiss={handleCancel}
      isOpen
    >
      <OdsText>
        <Trans
          t={t}
          i18nKey="iam_user_token_modal_message_delete"
          values={{ tokenName: tokenId }}
        />
      </OdsText>
    </Modal>
  );
}
