import { Trans, useTranslation } from 'react-i18next';
import { Link, Text } from '@ovhcloud/ods-react';
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
        <Text preset="caption" data-testid="privacy-policy">
          <Trans
            t={t}
            i18nKey="title"
            components={{
              anchor: (
                <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  id={`privacy-policy-link`}
                />
              ),
            }}
          />
        </Text>
      )}
    </footer>
  );
}
