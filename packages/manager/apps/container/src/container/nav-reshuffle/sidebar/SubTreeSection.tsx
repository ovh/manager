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

interface SubTreeSectionProps {
  node?: Node;
  selectedPciProject?: string;
}

const SubTreeSection: React.FC<ComponentProps<SubTreeSectionProps>> = ({
  node = {},
  selectedPciProject,
}: SubTreeSectionProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');

  const menuClickHandler = (node: Node) => {
    let trackingIdComplement = 'navbar_v2_entry_';
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
  };

  return (
    <>
      {node.children ? (
        <ul className={`mt-3 ${style.subtree_section}`}>
          <li>
            <h2 className={style.subtree_section_title}>
              {t(node.translation)}
            </h2>
          </li>

          {node.children?.map((childNode) => (
            <li key={childNode.id} id={childNode.id}>
              {!shouldHideElement(childNode, 1, 2) && (
                <SidebarLink
                  linkParams={{
                    projectId: selectedPciProject,
                  }}
                  node={childNode}
                  handleNavigation={() => menuClickHandler(childNode)}
                  id={childNode.idAttr}
                />
              )}
              {childNode.separator && <hr />}
            </li>
          ))}
        </ul>
      ) : (
        <SidebarLink
          linkParams={{
            projectId: selectedPciProject,
          }}
          node={node}
          handleNavigation={() => menuClickHandler(node)}
          id={node.idAttr}
        />
      )}
      {node.separator && <hr />}
    </>
  );
};

export default SubTreeSection;
