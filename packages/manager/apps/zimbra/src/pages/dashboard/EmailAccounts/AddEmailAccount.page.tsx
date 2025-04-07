import React from 'react';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useGenerateUrl } from '@/hooks';
import { ADD_EMAIL_ACCOUNT, BACK_PREVIOUS_PAGE } from '@/tracking.constant';
import AddAndEditEmailAccountForm from './AddAndEditEmailAccount.form';

export default function AddAndEditAccount() {
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
        <Subtitle>{t('common:add_email_account')}</Subtitle>
      </div>
      <AddAndEditEmailAccountForm />
    </>
  );
}
