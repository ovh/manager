import { LegalForm } from '@ovh-ux/manager-config';
import { useUserContext } from '@/context/user/useUser';

const getLegalFormKey = (legalForm: LegalForm): LegalForm => {
  switch (legalForm) {
    case 'individual':
    case 'corporation':
      return legalForm;
    default:
      return 'association';
  }
};

export const useReassuranceWording = () => {
  const user = useUserContext();

  if (!user?.legalForm || user.legalForm === 'other') {
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
