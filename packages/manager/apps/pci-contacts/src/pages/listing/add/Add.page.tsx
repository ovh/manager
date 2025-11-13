import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsSelect } from '@ovhcloud/ods-components/react';

import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { AccountAcl } from '@/data/api/acl';
import { useAddAccountAclToProject } from '@/data/hooks/useAcl';
import { useParam } from '@/hooks/useParam';
import { CONTACTS_TRACKING } from '@/tracking.constant';
import { normalizeAccountId } from '@/utils/normalize-account-id';

type AclRight = AccountAcl['type'];

export default function AddPage() {
  const { t } = useTranslation('contacts');
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();

  const projectId = useParam('projectId');
  const navigate = useNavigate();

  const [accountToAdd, setAccountToAdd] = useState<string>('');
  const [accountRights, setAccountRights] = useState<AclRight>('readOnly');
  const [isAccountInputTouched, setIsAccountInputTouched] = useState(false);
  const goBack = () => navigate('..');
  const normalizedAccountId = normalizeAccountId(accountToAdd);

  const { addAccountAclToProject, isPending } = useAddAccountAclToProject({
    projectId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: CONTACTS_TRACKING.ADD.REQUEST_SUCCESS,
      });
      addSuccess(
        <Translation ns="contacts">
          {(_t) => _t('cpb_rights_table_rights_add_success')}
        </Translation>,
      );
      goBack();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: CONTACTS_TRACKING.ADD.REQUEST_FAIL,
      });
      addError(<Translation ns="contacts">{(_t) => _t('cpb_rights_add_error')}</Translation>);
      goBack();
    },
  });

  const handleSubmit = () => {
    if (isPending) {
      return;
    }
    trackClick({
      actionType: 'action',
      actions: CONTACTS_TRACKING.ADD.CTA_CONFIRM,
    });
    const account: AccountAcl = {
      accountId: normalizedAccountId,
      type: accountRights,
    };
    addAccountAclToProject(account);
  };
  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: CONTACTS_TRACKING.ADD.CTA_CANCEL,
    });
    goBack();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      primaryLabel={t('cpb_rights_add')}
      onPrimaryButtonClick={handleSubmit}
      isPrimaryButtonDisabled={!normalizedAccountId}
      secondaryLabel={t('common_cancel')}
      onSecondaryButtonClick={handleCancel}
      heading={t('cpb_rights_add_title')}
      onDismiss={handleCancel}
      isOpen
    >
      <OdsFormField
        className="mb-6"
        error={isAccountInputTouched && !accountToAdd ? t('common_field_error_required') : ''}
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
          <option key="readOnly" value="readOnly">
            {t('cpb_rights_table_rights_value_readOnly')}
          </option>
          <option key="readWrite" value="readWrite">
            {t('cpb_rights_table_rights_value_readWrite')}
          </option>
        </OdsSelect>
      </OdsFormField>
    </Modal>
  );
}
