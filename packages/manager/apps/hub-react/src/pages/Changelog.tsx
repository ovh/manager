import { BaseLayout, HeadersProps } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

export default function Changelog() {
  const { t } = useTranslation('changelog');
  const header: HeadersProps = {
    title: t('changelog-title'),
  };
  return <BaseLayout header={header}></BaseLayout>;
}
