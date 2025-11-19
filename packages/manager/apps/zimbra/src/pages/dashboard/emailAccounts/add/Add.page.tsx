import { useTranslation } from 'react-i18next';

import { IconLinkAlignmentType, LinkType, Links } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { TEXT_PRESET, Text } from '@ovh-ux/muk';

import { useGenerateUrl } from '@/hooks';
import { ADD_EMAIL_ACCOUNT, BACK_PREVIOUS_PAGE } from '@/tracking.constants';

import EmailAccountForm from '../EmailAccountForm.component';

export const AddEmailAccount = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common']);
  const goBackUrl = useGenerateUrl('..', 'href');

  return (
    <>
      <div className="flex flex-col items-start space-y-4 mb-6" data-testid="page-title">
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
        <Text preset={TEXT_PRESET.heading3}>{t('common:add_email_account')}</Text>
      </div>
      <EmailAccountForm />
    </>
  );
};

export default AddEmailAccount;
