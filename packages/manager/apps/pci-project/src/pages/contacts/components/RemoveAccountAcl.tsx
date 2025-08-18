import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useDeleteAccountAclFromProject } from '@/data/hooks/useAcl';
import { useParam } from '@/hooks/useParam';

export default function RemoveAccountAcl() {
  const { t } = useTranslation(['contacts']);
  const { addSuccess, addError } = useNotifications();

  const navigate = useNavigate();
  const projectId = useParam('projectId');
  const { accountId } = useParams();

  const handleClose = () => navigate('..');

  const {
    deleteAccountAclFromProject,
    isPending,
  } = useDeleteAccountAclFromProject({
    projectId,
    onSuccess: () => {
      addSuccess(t('cpb_rights_table_rights_remove_success'));
      handleClose();
    },
    onError: () => {
      addError(t('cpb_rights_remove_error'));
      handleClose();
    },
  });
  const handleSubmit = () => {
    if (isPending || !accountId) {
      return;
    }
    deleteAccountAclFromProject(accountId);
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      primaryLabel={t('common_confirm')}
      onPrimaryButtonClick={handleSubmit}
      secondaryLabel={t('common_cancel')}
      onSecondaryButtonClick={handleClose}
      heading={t('cpb_rights_delete_title')}
      onDismiss={handleClose}
      isOpen={true}
    >
      <OdsText>
        {t('cpb_rights_delete_question', { nickname: accountId })}
      </OdsText>
    </Modal>
  );
}
