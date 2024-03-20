import { ExternalLink } from 'lucide-react';
import { database } from '@/models/database';
import { useServiceData } from '../../layout';
import { Link } from '@/components/links';

interface IntegrationServiceLinkProps {
  service: database.Service;
}
const IntegrationServiceLink = ({ service }: IntegrationServiceLinkProps) => {
  const { service: currentService, projectId } = useServiceData();
  const link =
    service.id === currentService.id ? (
      <></>
    ) : (
      <Link
        to={`/pci/projects/${projectId}/databases-analytics/${service.category}/services/${service.id}`}
      >
        <ExternalLink className="size-4 ml-2" />
        <span className="sr-only">Service {service.description}</span>
      </Link>
    );
  return (
    <div className="flex items-center">
      {service.description} {link}
    </div>
  );
};

export default IntegrationServiceLink;
