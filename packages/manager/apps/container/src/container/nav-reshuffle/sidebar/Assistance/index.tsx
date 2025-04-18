import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useURL, ContentURLS } from '@/container/common/urls-constants';
import { useShell } from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import useContainer from '@/core/container';
import { Node } from '../navigation-tree/node';
import { AssistanceLinkItem } from './AssistanceLinkItem';
import { ShortAssistanceLinkItem } from './ShortAssistanceLinkItem';
import { createPortal } from 'react-dom';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMenuItem,
  OsdsPopover,
  OsdsPopoverContent,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';

export interface AssistanceProps {
  nodeTree?: Node;
  isShort: boolean;
  selectedNode: Node;
  isLoading: boolean;
}

const AssistanceSidebar: React.FC<ComponentProps<AssistanceProps>> = ({
  nodeTree,
  selectedNode,
  isShort,
  isLoading,
}): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const { setChatbotReduced } = useContainer();

  const environment = shell.getPlugin('environment').getEnvironment();
  const urls = useURL(environment);
  const trackingPlugin = shell.getPlugin('tracking');
  const isEUOrCA = ['EU', 'CA'].includes(environment.getRegion());
  const { closeNavigationSidebar, setPopoverPosition } = useProductNavReshuffle();
  const popoverAnchorRef = useRef(null);

  useEffect(() => {
    nodeTree.children.forEach((node: Node) => {
      if (
        node.url &&
        typeof node.url === 'string' &&
        !node.url.startsWith('http')
      ) {
        node.url = urls.get(node.url as keyof ContentURLS);
      }
      switch (node.id) {
        case 'cloud_changelog':
          node.onClick = () => trackNode('cloud_changelog');
          break;
        case 'hosting_and_collab_changelog':
          node.onClick = () => trackNode('hosting_and_collab_changelog');
          break;
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
          node.url = isEUOrCA ? node.url : null;
          node.routing = !isEUOrCA
            ? {
                application: 'dedicated',
                hash: '#/ticket',
              }
            : null;
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

  useEffect(() => {
    const updatePopoverPosition = () => {
      if (popoverAnchorRef?.current)
        setPopoverPosition(
          popoverAnchorRef.current.getBoundingClientRect().bottom,
        );
    };
    updatePopoverPosition();

    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);

    return () => {
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
  }, [popoverAnchorRef, isShort]);

  const trackNode = (id: string) => {
    trackingPlugin.trackClick({
      name: `navbar_v3_entry_home::${id}`,
      type: 'navigation',
    });
  };
  if (isShort)
    return (
      <>
        <div
          ref={popoverAnchorRef}
          className="flex justify-center my-2 h-[3.5rem]"
          tabIndex={0}
          onFocus={() => document.getElementById('useful-links-button')?.focus()}
          data-testid="short-assistance-link-popover-anchor"
        >
        </div>
      </>
    );

  return (
    <ul className="mt-auto pb-3 flex-none" id="useful-links" role="menu" data-testid="assistance-sidebar">
      {nodeTree.children.map((node: Node) => (
        <AssistanceLinkItem
          key={`assistance_${node.id}`}
          node={node}
          isLoading={isLoading}
          isSelected={node.id === selectedNode?.id}
        />
      ))}
    </ul>
  );
};

export default AssistanceSidebar;
