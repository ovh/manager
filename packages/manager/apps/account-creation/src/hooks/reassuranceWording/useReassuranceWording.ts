import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import userContext from '@/context/user/user.context';

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
  const user = useContext(userContext);
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
