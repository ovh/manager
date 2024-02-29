import { ovhUrl } from '@/components/ovhNavigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServicesConsumptionProps {
  imgLink: string;
  title: string;
  titleLink: string;
  isExternalLink: boolean;
  link: string;
  activeServices?: number;
  stoppedServices?: number;
}

export default function ServicesConsumption({
  imgLink,
  title,
  titleLink,
  isExternalLink,
  link,
  activeServices,
  stoppedServices,
}: ServicesConsumptionProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <img width={100} height={100} src={imgLink} alt="" />
        <p className="font-semibold">{title}</p>
        <Button className="mb-2" variant="linkBis" size="sm" asChild>
          {isExternalLink ? (
            <a href={ovhUrl('public-cloud', link, {})}>
              {titleLink}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          ) : (
            <Link to={link}>
              {titleLink}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
        </Button>
        {activeServices != undefined && (
          <div className="flex flew-row font-semibold gap-2">
            <Badge variant="success">{activeServices} in service</Badge>
            <Badge variant="warning">{stoppedServices} stopped</Badge>
          </div>
        )}
      </div>
    </>
  );
}
