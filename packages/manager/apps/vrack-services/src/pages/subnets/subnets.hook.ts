import { useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/router/constants';

export const useNavigateToCreateSubnetPage = () => {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { id } = useParams();

  return () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actions: ['create-subnet'],
    });
    navigate(urls.createSubnet.replace(':id', id));
  };
};
