import { useTranslation } from 'react-i18next';

interface BreadcrumbItemProps {
  translationKey: string;
  namespace: string;
}
const BreadcrumbItem = ({ translationKey, namespace }: BreadcrumbItemProps) => {
  const { t } = useTranslation(namespace);
  return t(translationKey);
};

export default BreadcrumbItem;
