import { Links, LinkType, Title } from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';

import { useGenerateUrl } from '@/hooks';
import ImportForm from './steps/ImportForm.component';

export default function ImportPage() {
  const { t } = useTranslation('common');
  const goBackUrl = useGenerateUrl('..', 'href');
  return (
    <>
      <Title>{t('import_website')}</Title>
      <Links
        type={LinkType.back}
        href={goBackUrl}
        label={t('web_hosting_common_sites_backlink')}
        className="mb-4"
      />
      <ImportForm />
    </>
  );
}
