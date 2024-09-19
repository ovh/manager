import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useURL, ContentURLS } from '@/container/common/urls-constants';
import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import useContainer from '@/core/container';
import { Node } from '../navigation-tree/node';
import { AssistanceLinkItem } from './AssistanceLinkItem';
import { ShortAssistanceLinkItem } from './ShortAssistanceLinkItem';
import { OsdsButton, OsdsIcon, OsdsMenuItem, OsdsPopover, OsdsPopoverContent } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

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

  if (isShort) return (
    <OsdsPopover className='w-full fixed z-[1000] left-[0.3rem] bottom-[3rem]' id="useful-links" role="menu">
      <OsdsButton
        slot="popover-trigger"
        className='w-[4rem]'
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        title={t('sidebar_assistance_title')}
        contrasted
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ELLIPSIS}
          contrasted
        />
      </OsdsButton>
      <OsdsPopoverContent>
        {nodeTree.children.map((node: Node) => (
          <ShortAssistanceLinkItem key={node.id} node={node} />
        ))}
      </OsdsPopoverContent>
    </OsdsPopover>
  )

  return (
    <ul className="mt-auto pb-3 flex-none" id="useful-links2" role="menu">
      <li className="assistance_header px-3 mb-3">
        <h2 className="flex justify-between">
          <span>{t('sidebar_assistance_title')}</span>
        </h2>
      </li>
      {nodeTree.children.map((node: Node) => (

        <AssistanceLinkItem
          key={`assistance_${node.id}`}
          node={node}
          isSelected={node.id === selectedNode?.id}
        />
      ))}
    </ul>);
};

export default AssistanceSidebar;
