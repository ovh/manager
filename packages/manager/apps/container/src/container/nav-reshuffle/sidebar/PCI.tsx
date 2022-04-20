import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import pciNode from './navigation-tree/pci';
import { Node } from './navigation-tree/node';
import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import { countServices } from './utils';

type Props = {
  onExit(): void;
  onSelectProject(project: unknown): void;
  projects: unknown[];
  selectedProject?: unknown;
  servicesCount?: number;
};

export default function PciMenu({
  onExit,
  onSelectProject,
  projects,
  selectedProject = '',
  servicesCount = 0,
}: Props): JSX.Element {
  const { t } = useTranslation('sidebar');
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentNavigationNode, setCurrentNavigationNode] = useState(pciNode);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(
    projects.indexOf(selectedProject),
  );

  const clickHandler = (node: Node) => {
    if (node.children) {
      setNavigationHistory([...navigationHistory, currentNavigationNode]);
      setCurrentNavigationNode(node);
    } else if (node.path) {
      // @TODO use navigation plugin
      // console.log('navigate to', node.path);
    }
  };

  const goBackHandler = () => {
    if (navigationHistory.length === 0) {
      onExit();
    } else {
      setCurrentNavigationNode(navigationHistory.pop());
      setNavigationHistory(navigationHistory);
    }
  };

  const selectProjectHandler = (index) => {
    setCurrentProjectIndex(index);
    onSelectProject(projects[index]);
  };

  return (
    <div className={style.pci}>
      <ul>
        <a className={style.sidebar_back_btn} onClick={goBackHandler}>
          <span
            className="oui-icon oui-icon-chevron-left"
            aria-hidden="true"
          ></span>
          {t('sidebar_back')}
        </a>
        <li>
          <select
            value={currentProjectIndex}
            onChange={(e) => selectProjectHandler([e.target.value])}
          >
            {projects.map((project, index) => (
              <option value={index} key={index}>
                {project.description || project.project_id}
              </option>
            ))}
          </select>
        </li>
        {currentNavigationNode.children?.map((node) => (
          <li key={node.id}>
            <SidebarLink
              node={node}
              count={countServices(servicesCount, node)}
              onClick={() => clickHandler(node)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
