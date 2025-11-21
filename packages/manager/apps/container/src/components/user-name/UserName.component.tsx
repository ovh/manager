import { LEGAL_FORMS } from '@/container/common/constants';
import useUser from "@/hooks/user/useUser";

export const UserName = () => {
  const user = useUser();
  
  return user.legalform === LEGAL_FORMS.CORPORATION
    ? user.organisation
    : `${user.firstname} ${user.name}`;
}