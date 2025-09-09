import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsSelect,
} from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useAddAccountAclToProject } from '@/data/hooks/useAcl';
import { AccountAcl } from '@/data/api/acl';
import { useParam } from '@/hooks/useParam';
import { normalizeAccountId } from '@/utils/normalize-account-id';

type AclRight = AccountAcl['type'];

export default function AddAccountAcl() {
  const { t } = useTranslation(['contacts', 'pci-common']);
  const { addSuccess, addError } = useNotifications();

  const projectId = useParam('projectId');
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const user = context.environment.getUser();

  const [accountToAdd, setAccountToAdd] = useState<string>('');
  const [accountRights, setAccountRights] = useState<AclRight>('readOnly');
  const [isAccountInputTouched, setIsAccountInputTouched] = useState(false);
  const handleClose = () => navigate('..');
  const normalizedAccountId = normalizeAccountId(accountToAdd);

  const { addAccountAclToProject, isPending } = useAddAccountAclToProject({
    projectId,
    onSuccess: () => {
      addSuccess(t('cpb_rights_table_rights_add_success'));
      handleClose();
    },
    onError: () => {
      addError(t('cpb_rights_add_error'));
      handleClose();
    },
  });

  const handleSubmit = () => {
    if (isPending) {
      return;
    }
    const account: AccountAcl = {
      accountId: normalizedAccountId,
      type: accountRights,
    };
    addAccountAclToProject(account);
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      primaryLabel={t('cpb_rights_add')}
      onPrimaryButtonClick={handleSubmit}
      isPrimaryButtonDisabled={!normalizedAccountId}
      secondaryLabel={t('common_cancel')}
      onSecondaryButtonClick={handleClose}
      heading={t('cpb_rights_add_title')}
      onDismiss={handleClose}
      isOpen={true}
    >
      <OdsFormField
        className="mb-6"
        error={
          isAccountInputTouched && !accountToAdd
            ? t('pci-common:common_field_error_required')
            : ''
        }
      >
        <label htmlFor="contactInput" slot="label">
          {t('cpb_rights_table_nichandle')}
        </label>
        <OdsInput
          type={ODS_INPUT_TYPE.text}
          name="contactInput"
          value={accountToAdd}
          onOdsBlur={() => setIsAccountInputTouched(true)}
          onOdsChange={(e) => setAccountToAdd(e.detail.value as string)}
          hasError={isAccountInputTouched && !accountToAdd}
        />
      </OdsFormField>
      <OdsFormField>
        <label htmlFor="selectRightType" slot="label">
          {t('cpb_rights_table_rights')}
        </label>
        <OdsSelect
          name="selectRightType"
          value={accountRights}
          onOdsChange={(e) => setAccountRights(e.detail.value as AclRight)}
        >
          <option key={'readOnly'} value={'readOnly'}>
            {t('cpb_rights_table_rights_value_readOnly')}
          </option>
          <option key={'readWrite'} value={'readWrite'}>
            {t('cpb_rights_table_rights_value_readWrite')}
          </option>
        </OdsSelect>
      </OdsFormField>
    </Modal>
  );
}
