import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType } from '@ovh-ux/muk';

import { useGenerateUrl } from '@/hooks';
import { ADD_EMAIL_ACCOUNT, BACK_PREVIOUS_PAGE } from '@/tracking.constants';

import EmailAccountForm from '../EmailAccountForm.component';

export const AddEmailAccount = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common']);
  const goBackUrl = useGenerateUrl('..', 'href');

  return (
    <>
      <div className="mb-6 flex flex-col items-start space-y-4" data-testid="page-title">
        <Link
          type={LinkType.back}
          href={goBackUrl}
          onClick={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.link,
              actionType: 'navigation',
              actions: [ADD_EMAIL_ACCOUNT, BACK_PREVIOUS_PAGE],
            });
          }}
        >
          {t('zimbra_account_add_cta_back')}
        </Link>
        <Text preset={TEXT_PRESET.heading3}>{t('common:add_email_account')}</Text>
      </div>
      <EmailAccountForm />
    </>
  );
};

export default AddEmailAccount;
