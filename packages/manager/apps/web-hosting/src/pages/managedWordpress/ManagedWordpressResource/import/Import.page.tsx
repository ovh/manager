import {
  Links,
  LinkType,
  Notifications,
} from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGenerateUrl } from '@/hooks';
import ImportForm from './steps/ImportForm.component';

export default function ImportPage() {
  const { t } = useTranslation(['common', NAMESPACES.FORM]);
  const goBackUrl = useGenerateUrl('..', 'href');
  return (
    <div className="flex flex-col items-start w-full md:w-1/2 gap-4 mt-4">
      <OdsText preset={ODS_TEXT_PRESET.heading1} className="mb-4">
        {t('import_website')}
      </OdsText>
      <Links
        type={LinkType.back}
        href={goBackUrl}
        label={t('web_hosting_common_sites_backlink')}
        className="mb-4"
      />
      <Notifications />
      <OdsText preset={ODS_TEXT_PRESET.span}>
        {t(`${NAMESPACES.FORM}:mandatory_fields`)}
      </OdsText>
      <ImportForm />
    </div>
  );
}
