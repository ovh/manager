import { useShell } from '@/context';
import { NodeRouting } from '../sidebar/navigation-tree/node';

export const useSidebarUrl = (routing: NodeRouting) => {
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');

  return routing?.application && routing?.hash
    ? navigation.getURL(routing.application, routing.hash)
    : null;
};
