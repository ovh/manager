import { useMemo } from 'react';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { useURL, ContentURLS } from '@/container/common/urls-constants';
import { useShell } from '@/context';
import { Node } from '@/types/node';
import { useNodeUrl } from './useNodeUrl';

export const useSidebarAssistanceLinks = () => {
  const { navigationTree } = useProductNavReshuffle();
  const shell = useShell();
  const environment = shell.getPlugin('environment').getEnvironment();
  const urls = useURL(environment);
  const getUrl = useNodeUrl();

  return useMemo(
    () =>
      navigationTree.children
        .find((node: Node) => node.id === 'assistance')
        .children.map((node: Node) => {
          if (
            node.url &&
            typeof node.url === 'string' &&
            !node.url.startsWith('http')
          ) {
            return { ...node, url: urls.get(node.url as keyof ContentURLS) };
          }
          return { ...node, url: getUrl(node.routing) };
        }),
    [navigationTree.children, urls, getUrl],
  );
};
