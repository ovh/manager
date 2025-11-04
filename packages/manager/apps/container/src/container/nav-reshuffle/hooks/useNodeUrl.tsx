import { useShell } from '@/context';
import { NodeRouting } from '@/types/node';

export const useNodeUrl = () => {
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');

  return (routing: NodeRouting) => {
    return routing?.application && routing?.hash
      ? navigation.getURL(routing.application, routing.hash)
      : null;
  };
};
