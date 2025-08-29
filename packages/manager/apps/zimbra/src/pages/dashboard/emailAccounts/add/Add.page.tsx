import React from 'react';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useGenerateUrl } from '@/hooks';
import { ADD_EMAIL_ACCOUNT, BACK_PREVIOUS_PAGE } from '@/tracking.constants';
import EmailAccountForm from '../EmailAccountForm.component';

export const AddEmailAccount = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common']);
  const goBackUrl = useGenerateUrl('..', 'href');

  return (
    <>
      <div
        className="flex flex-col items-start space-y-4 mb-6"
        data-testid="page-title"
      >
        <Links
          iconAlignment={IconLinkAlignmentType.left}
          type={LinkType.back}
          href={goBackUrl}
          onClickReturn={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.link,
              actionType: 'navigation',
              actions: [ADD_EMAIL_ACCOUNT, BACK_PREVIOUS_PAGE],
            });
          }}
          label={t('zimbra_account_add_cta_back')}
        />
        <OdsText preset="heading-3">{t('common:add_email_account')}</OdsText>
      </div>
      <EmailAccountForm />
    </>
  );
};

export default AddEmailAccount;
