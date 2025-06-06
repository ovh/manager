import { useLocation } from 'react-router-dom';
import { useUserContext } from '@/context/user/useUser';
import { urls } from '@/routes/routes.constant';

const getLegalFormKey = (legalForm: string): string => {
  switch (legalForm) {
    case 'individual':
    case 'corporation':
      return legalForm;
    default:
      return 'association';
  }
};

export const useReassuranceWording = () => {
  const { pathname } = useLocation();
  const user = useUserContext();

  if (pathname !== urls.accountDetails || !user?.legalForm) {
    return {
      title: 'generic_title',
      description: 'generic_description',
    };
  }

  const legalFormKey = getLegalFormKey(user.legalForm);

  return {
    title: `details_title_${legalFormKey}`,
    description: `details_description_${legalFormKey}`,
  };
};
