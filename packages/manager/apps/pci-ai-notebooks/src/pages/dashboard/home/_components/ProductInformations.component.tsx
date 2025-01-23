import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OvhLink from '@/components/links/OvhLink.component';
import { Badge } from '@/components/ui/badge';
import Link from '@/components/links/Link.component';

interface ProductInformationsProps {
  img: string;
  title: string;
  productName: string;
  link: string;
  showConsumptionInfos: boolean;
  isInternalAppLink: boolean;
  active?: number;
  stopped?: number;
}

export default function ProductInformations({
  img,
  title,
  productName,
  link,
  isInternalAppLink,
  showConsumptionInfos,
  active,
  stopped,
}: ProductInformationsProps) {
  const { t } = useTranslation('pci-ai-dashboard/home');
  return (
    <div className="flex flex-col items-center">
      <img width={100} height={100} src={img} alt="" />
      <p className="font-semibold">{title}</p>
      {isInternalAppLink ? (
        <Link className="mx-1" to={link}>
          {productName}
          <ArrowRight className="size-4 inline ml-1" />
        </Link>
      ) : (
        <OvhLink application="public-cloud" path={link}>
          {productName}
          <ArrowRight className="size-4 inline ml-1" />
        </OvhLink>
      )}
      {showConsumptionInfos && (
        <div className="flex flew-row font-semibold gap-2 mt-2">
          <Badge variant="success">
            {t('ai-product-active', {
              number: active,
            })}
          </Badge>
          <Badge variant="warning">
            {t('ai-product-stopped', {
              number: stopped,
            })}
          </Badge>
        </div>
      )}
    </div>
  );
}
