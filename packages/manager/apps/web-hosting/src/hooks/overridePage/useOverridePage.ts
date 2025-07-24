import { useMatches } from 'react-router-dom';
<<<<<<< HEAD

=======
>>>>>>> 8271b8fadde (feat(web-hosting): add listing pages resource and websites)
import { RouteMatch } from '@/routes/routes';

export const useOverridePage = (): boolean => {
  const matches = useMatches() as RouteMatch[];
  return matches.some((match) => match?.handle?.isOverridePage);
};
