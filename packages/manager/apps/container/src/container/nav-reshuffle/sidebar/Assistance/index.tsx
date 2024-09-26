import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useURL, ContentURLS } from '@/container/common/urls-constants';
import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import useContainer from '@/core/container';
import { Node } from '../navigation-tree/node';
import { AssistanceLinkItem } from './AssistanceLinkItem';
import { ShortAssistanceLinkItem } from './ShortAssistanceLinkItem';

interface AssistanceProps {
  nodeTree?: Node;
  isShort: boolean;
  selectedNode: Node;
}

const AssistanceSidebar: React.FC<ComponentProps<AssistanceProps>> = ({
  nodeTree,
  selectedNode,
  isShort
}): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const { shell } = useContext(ApplicationContext);
  const { setChatbotReduced } = useContainer();

  const environment = shell
    .getPluginManager()
    .getPlugin('environment')
    .getEnvironment();
  const urls = useURL(environment);
  const trackingPlugin = shell.getPlugin('tracking');
  const isEUOrCA = ['EU', 'CA'].includes(environment.getRegion());
  const { closeNavigationSidebar } = useProductNavReshuffle();

  useEffect(() => {
    nodeTree.children.forEach((node: Node) => {
      if (node.url && typeof node.url === 'string' && !node.url.startsWith('http')) {
        node.url = urls.get(node.url as keyof ContentURLS);
      }
      switch (node.id) {
        case 'marketplace':
          node.onClick = () => trackNode('marketplace');
          break;
        case 'help':
          node.onClick = () => trackNode('assistance_help_center');
          node.url = node.url;
          node.isExternal = true;
          break;
        case 'tickets':
            node.onClick = () => trackNode('assistance_support_tickets');
            node.url =  isEUOrCA ? node.url : null;
            node.routing = !isEUOrCA ? {
              application: 'dedicated',
              hash: '#/ticket',
            } : null;
            node.isExternal = isEUOrCA;
            break;
        case 'assistance_status':
          node.onClick = () => trackNode('assistance_status');
          break;
        case 'livechat':
          node.onClick = () => {
            shell.getPlugin('ux').openLiveChat();
            setChatbotReduced(false);
            trackNode('assistance_live_chat');
            closeNavigationSidebar();
          };
          break;
        case 'carbon_calculator':
          node.onClick = () => {
            trackNode('carbon_calculator');
            closeNavigationSidebar();
          };
          break;
        default:
          break;
      }
    });
  }, []);

  const trackNode = (id: string) => {
    trackingPlugin.trackClick({ name: `navbar_v3_entry_home::${id}`, type: 'navigation' });
  };

  return (
    <ul className="mt-auto pb-3" id="useful-links" role="menu">
      {!isShort &&
        <li className="assistance_header px-3 mb-3">
          <h2 className="flex justify-between">
            <span>{t('sidebar_assistance_title')}</span>
          </h2>
        </li>}
      {nodeTree.children.map((node: Node) => (isShort ?
        <ShortAssistanceLinkItem
          key={`assistance_${node.id}`}
          node={node}
          isSelected={node.id === selectedNode?.id}
        /> :
        <AssistanceLinkItem
          key={`assistance_${node.id}`}
          node={node}
          isSelected={node.id === selectedNode?.id}
        />))}
    </ul>
  );
};

export default AssistanceSidebar;
