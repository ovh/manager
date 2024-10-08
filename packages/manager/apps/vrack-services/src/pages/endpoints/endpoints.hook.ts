import { useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constants';

export const useNavigateToCreateEndpointPage = () => {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { id } = useParams();

  return () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actions: ['create-endpoint'],
    });
    navigate(urls.createEndpoint.replace(':id', id));
  };
};
