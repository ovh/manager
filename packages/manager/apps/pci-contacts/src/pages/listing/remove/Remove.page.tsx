import { useNavigate, useParams } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useDeleteAccountAclFromProject } from '@/data/hooks/useAcl';
import { useParam } from '@/hooks/useParam';
import { CONTACTS_TRACKING } from '@/tracking.constant';

export default function RemovePage() {
  const { t } = useTranslation('contacts');
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();

  const navigate = useNavigate();
  const projectId = useParam('projectId');
  const { accountId } = useParams();

  const goBack = () => navigate('..');

  const { deleteAccountAclFromProject, isPending } = useDeleteAccountAclFromProject({
    projectId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: CONTACTS_TRACKING.REMOVE.REQUEST_SUCCESS,
      });
      addSuccess(
        <Translation ns="contacts">
          {(_t) => _t('cpb_rights_table_rights_remove_success')}
        </Translation>,
      );
      goBack();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: CONTACTS_TRACKING.REMOVE.REQUEST_FAIL,
      });
      addError(<Translation ns="contacts">{(_t) => _t('cpb_rights_remove_error')}</Translation>);
      goBack();
    },
  });
  const handleSubmit = () => {
    if (isPending || !accountId) {
      return;
    }
    trackClick({
      actionType: 'action',
      actions: CONTACTS_TRACKING.REMOVE.CTA_CONFIRM,
    });
    deleteAccountAclFromProject(accountId);
  };
  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: CONTACTS_TRACKING.REMOVE.CTA_CANCEL,
    });
    goBack();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      primaryLabel={t('common_confirm')}
      onPrimaryButtonClick={handleSubmit}
      secondaryLabel={t('common_cancel')}
      onSecondaryButtonClick={handleCancel}
      heading={t('cpb_rights_delete_title')}
      onDismiss={handleCancel}
      isOpen={true}
    >
      <OdsText>{t('cpb_rights_delete_question', { nickname: accountId })}</OdsText>
    </Modal>
  );
}
