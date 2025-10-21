import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LinkType, Links, Notifications } from '@ovh-ux/manager-react-components';

import { useManagedCmsLatestPhpVersion } from '@/data/hooks/managedWordpress/managedWordpressReferenceSupportedPHPVersions/managedWordpressReferenceSupportedPHPVersions';

import ImportForm from './importForm/ImportForm.component';

export default function ImportPage() {
  const { t } = useTranslation(['common', NAMESPACES.FORM, 'managedWordpress']);
  const { data } = useManagedCmsLatestPhpVersion();
  const lastVersionPhp = Array.isArray(data) && data.length > 0 ? data[data.length - 1] : undefined;
  const navigate = useNavigate();
  const goBackUrl = () => navigate(-1);
  return (
    <div className="flex flex-col items-start w-full md:w-1/2 gap-4 mt-4">
      <OdsText preset={ODS_TEXT_PRESET.heading1} className="mb-4">
        {t('import_website')}
      </OdsText>
      <Links
        type={LinkType.back}
        onClickReturn={goBackUrl}
        label={t('web_hosting_common_sites_backpage')}
        className="mb-4"
      />
      <Notifications />
      <OdsMessage isDismissible={false} className="w-full">
        {t('managedWordpress:web_hosting_managed_wordpress_import_last_php_version', {
          version: lastVersionPhp,
        })}
      </OdsMessage>

      <OdsText preset={ODS_TEXT_PRESET.span}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</OdsText>
      <ImportForm />
    </div>
  );
}
