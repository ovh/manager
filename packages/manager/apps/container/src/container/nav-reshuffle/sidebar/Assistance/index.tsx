import React, { useEffect, useState, useRef } from 'react';
import { useURL, ContentURLS } from '@/container/common/urls-constants';
import { useShell } from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import useContainer from '@/core/container';
import { Node } from '../navigation-tree/node';
import { AssistanceLinkItem } from './AssistanceLinkItem';

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
  const shell = useShell();
  const { setChatbotReduced } = useContainer();

  const environment = shell.getPlugin('environment').getEnvironment();
  const urls = useURL(environment);
  const trackingPlugin = shell.getPlugin('tracking');
  const region = environment.getRegion();

  const {
    closeNavigationSidebar,
    setPopoverPosition,
  } = useProductNavReshuffle();
  const popoverAnchorRef = useRef(null);

  const trackNode = (id: string) => {
    trackingPlugin.trackClick({
      name: `navbar_v3_entry_home::${id}`,
      type: 'navigation',
    });
  };

  const assistanceTree = nodeTree.children
    .map((node: Node) => {
      if (
        node.url &&
        typeof node.url === 'string' &&
        !node.url.startsWith('http')
      ) {
        node.url = urls.get(node.url as keyof ContentURLS);
      }
      switch (node.id) {
        case 'roadmap_changelog':
          node.onClick = () => trackNode('changelog-roadmap');
          break;
        case 'marketplace':
          node.onClick = () => trackNode('marketplace');
          break;
        case 'help':
          node.onClick = () => trackNode('assistance_help_center');
          node.isExternal = true;
          break;
        case 'tickets':
          node.onClick = () => trackNode('assistance_support_tickets');
          break;
        case 'createTicket':
          node.onClick = () => trackNode('assistance_create_ticket');
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
      return node;
    });

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

  if (isShort)
    return (
      <>
        <div
          ref={popoverAnchorRef}
          className="flex justify-center my-2 h-[3.5rem]"
          tabIndex={0}
          onFocus={() =>
            document.getElementById('useful-links-button')?.focus()
          }
          data-testid="short-assistance-link-popover-anchor"
        ></div>
      </>
    );

  return (
    <ul
      className="mt-auto pb-3 flex-none"
      id="useful-links"
      role="menu"
      data-testid="assistance-sidebar"
    >
      {assistanceTree.map((node: Node) => (
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
