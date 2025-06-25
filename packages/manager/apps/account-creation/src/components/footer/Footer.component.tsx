import { Trans, useTranslation } from 'react-i18next';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { usePrivacyPolicyLink } from '@ovh-ux/manager-gcj-module';
import { useMe } from '@/data/hooks/useMe';

export default function Footer() {
  const { t } = useTranslation('footer');
  const { data: currentUser } = useMe();
  const link = usePrivacyPolicyLink(
    (currentUser?.ovhSubsidiary as OvhSubsidiary) || 'FR',
    currentUser?.language || 'fr_FR',
  );

  return (
    <footer className="p-5 flex flex-row justify-between" data-testid="footer">
      {currentUser?.ovhSubsidiary && currentUser?.language && (
        <OdsText preset={ODS_TEXT_PRESET.caption} data-testid="privacy-policy">
          <Trans
            t={t}
            i18nKey="title"
            components={{
              Link: (
                <OdsLink
                  href={link}
                  color={ODS_LINK_COLOR.primary}
                  id={`privacy-policy-link`}
                />
              ),
            }}
          />
        </OdsText>
      )}
    </footer>
  );
}
