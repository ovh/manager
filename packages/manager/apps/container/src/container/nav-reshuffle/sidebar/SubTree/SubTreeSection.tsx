import React from 'react';
import style from './style.module.scss';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';
import SidebarLink from '@/container/nav-reshuffle/sidebar/SidebarLink';

import {
  findPathToNode,
  shouldHideElement,
} from '@/container/nav-reshuffle/sidebar/utils';
import { useTranslation } from 'react-i18next';
import navigationRoot from '@/container/nav-reshuffle/sidebar/navigation-tree/root';
import { useShell } from '@/context';

export interface SubTreeSectionProps {
  node?: Node;
  selectedPciProject?: string;
  selectedNode: Node;
  handleOnSubMenuClick(node: Node): void;
}

const SubTreeSection: React.FC<ComponentProps<SubTreeSectionProps>> = ({
  node = {},
  selectedPciProject,
  selectedNode,
  handleOnSubMenuClick,
}: SubTreeSectionProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');

  const menuClickHandler = (node: Node) => {
    let trackingIdComplement = 'navbar_v3_entry_';
    const history = findPathToNode(
      navigationRoot,
      (n: Node) => n.id === node.id,
    );
    trackingIdComplement = history.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        return accumulator + `${currentValue.id.replace(/-/g, '_')}::`;
      }
    }, trackingIdComplement);
    trackingPlugin.trackClick({
      name: trackingIdComplement.replace(/::$/g, ''),
      type: 'navigation',
    });
    handleOnSubMenuClick(node);
  };

  return (
    <>
      {node.children ? (
        <ul
          className={`mt-3 pb-2 ${style.subtree_section}`}
          role="group"
          aria-label={t(node.translation)}
          data-testid={`subtree-section-ul-${node.id}`}
        >
          <li className="px-3">
            <h2 className={style.subtree_section_title}>
              {t(node.translation)}
            </h2>
          </li>

          {node.children
            ?.filter((childNode) => !shouldHideElement(childNode, 1))
            .map((childNode, index) => (
              <li
                key={childNode.id + index}
                id={childNode.id}
                role="menuitem"
                className={`${
                  childNode.id === selectedNode?.id
                    ? style.subtree_submenu_items_selected
                    : style.subtree_submenu_items
                }`}
              >
                  <SidebarLink
                    linkParams={{
                      projectId: selectedPciProject,
                    }}
                    node={childNode}
                    count={childNode.count}
                    handleOnClick={() => menuClickHandler(childNode)}
                    id={childNode.idAttr}
                    className="px-3"
                  />
                  {childNode.separator && <hr role="separator" />}
              </li>
            ))}
        </ul>
      ) : (
        <div
          className={`${
            node.id === selectedNode?.id
              ? style.subtree_submenu_items_selected
              : style.subtree_submenu_items
          }`}
          data-testid={`subtree-section-link-${node.id}`}
        >
          <SidebarLink
            linkParams={{
              projectId: selectedPciProject,
            }}
            node={node}
            count={node.count}
            handleOnClick={() => menuClickHandler(node)}
            id={node.idAttr}
          />
        </div>
      )}
      {node.separator && <hr role="separator" />}
    </>
  );
};

export default SubTreeSection;
