import { actionSectionRegex } from '@/constants';
import { usePathMatch } from '@/hooks/url/usePathMatch';
import { TSectionType } from '@/types/instance/action/action.type';

export const useActionSection = (): TSectionType | null => {
  const section = usePathMatch<TSectionType>(actionSectionRegex);
  return section;
};
