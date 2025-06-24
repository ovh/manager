import { useLocation } from 'react-router-dom';
import { useUserContext } from '@/context/user/useUser';

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
  const currentPage = pathname.replace('/', '');

  if (currentPage !== 'info' || !user?.legalForm) {
    return {
      title: 'generic_title',
      description: 'generic_description',
    };
  }

  const legalFormKey = getLegalFormKey(user.legalForm);

  return {
    title: `info_title_${legalFormKey}`,
    description: `info_description_${legalFormKey}`,
  };
};
