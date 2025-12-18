import { useShell } from '@/context';
import { useURL, ContentURLS } from '@/container/common/urls-constants';
import { assistanceTree } from '../../container/nav-reshuffle/sidebar/navigation-tree/assistance';

export const useSupport = (): string => {
  const shell = useShell();
  const environment = shell.getPlugin('environment').getEnvironment();
  const urls = useURL(environment);
  const region = environment.getRegion();
  const ticketLink = assistanceTree.children.find(
    (link) => link.id === 'tickets' && link.region.includes(region),
  );
  return urls.get(ticketLink.url as keyof ContentURLS);
};
