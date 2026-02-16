import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Message, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link, LinkType, Notifications } from '@ovh-ux/muk';

import { useManagedCmsLatestPhpVersion } from '@/data/hooks/managedWordpress/managedWordpressReferenceSupportedPHPVersions/managedWordpressReferenceSupportedPHPVersions';

import ImportForm from './importForm/ImportForm.component';

export default function ImportPage() {
  const { t } = useTranslation(['common', NAMESPACES.FORM, 'managedWordpress']);
  const { data } = useManagedCmsLatestPhpVersion();
  const lastVersionPhp = Array.isArray(data) && data.length > 0 ? data[data.length - 1] : undefined;
  const navigate = useNavigate();
  const goBackUrl = () => navigate(-1);
  return (
    <div className="mt-4 flex flex-col items-start gap-4 md:w-1/2">
      <Text preset={TEXT_PRESET.heading1} className="mb-4">
        {t('common:import_website')}
      </Text>
      <Link type={LinkType.back} onClick={goBackUrl} className="mb-4">
        {t('common:web_hosting_common_sites_backpage')}
      </Link>
      <Notifications />
      <Message dismissible={false} className="w-full">
        {t('managedWordpress:web_hosting_managed_wordpress_import_last_php_version', {
          version: lastVersionPhp,
        })}
      </Message>

      <Text preset={TEXT_PRESET.span}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</Text>
      <ImportForm />
    </div>
  );
}
