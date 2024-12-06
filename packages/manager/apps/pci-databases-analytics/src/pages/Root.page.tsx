import { redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import Services from './services/Services.page';
import { getServices } from '@/data/api/database/service.api';

interface ServicesProps {
  params: {
    projectId: string;
    category: string;
  };
  request: Request;
}
export const Loader = ({ params }: ServicesProps) => {
  // check if we have a correct category
  const { category, projectId } = params;
  // check if we have a correct projectId
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'database/service'],
      queryFn: () => getServices({ projectId }),
    })
    .then((services) => {
      if (services.length === 0) {
        return redirect(
          `/pci/projects/${projectId}/databases-analytics/${category}/services/onboarding`,
        );
      }
      return null;
    });
};

export default function Root() {
  return <Services />;
}
