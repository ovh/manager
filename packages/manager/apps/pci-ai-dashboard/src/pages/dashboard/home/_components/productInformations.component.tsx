import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OvhLink from '@/components/links/OvhLink.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductInformationsProps {
  img: string;
  title: string;
  productName: string;
  link: string;
  showConsumptionInfos: boolean;
  active?: number;
  stopped?: number;
}

export default function ProductInformations({
  img,
  title,
  productName,
  link,
  showConsumptionInfos,
  active,
  stopped,
}: ProductInformationsProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <img width={100} height={100} src={img} alt="" />
        <p className="font-semibold">{title}</p>
        <OvhLink application="public-cloud" path={link}>
          <div className="flex flew-row justify-center items-center gap-1">
            {productName} <ArrowRight className="w-4 h-4 mt-1" />
          </div>
        </OvhLink>

        {showConsumptionInfos && (
          <div className="flex flew-row font-semibold gap-2 mt-2">
            <Badge variant="success">{active} in service</Badge>
            <Badge variant="warning">{stopped} stopped</Badge>
          </div>
        )}
      </div>
    </>
  );
}
