import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { countServices } from './utils';
import SidebarLink from './sidebar-link';
import pciNode from './navigation-tree/pci';
import style from './style.module.scss';

export default function PciMenu({
  onExit,
  projects,
  selectedProject,
  servicesCount,
  onSelectProject,
}) {
  const { t } = useTranslation('sidebar');
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentNavigationNode, setCurrentNavigationNode] = useState(pciNode);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(
    projects.indexOf(selectedProject),
  );

  const clickHandler = (node) => {
    if (node.children) {
      setNavigationHistory([...navigationHistory, currentNavigationNode]);
      setCurrentNavigationNode(node);
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
              linkParams={{ projectId: selectedProject?.project_id }}
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

PciMenu.propTypes = {
  onExit: PropTypes.func.isRequired,
  onSelectProject: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  selectedProject: PropTypes.any,
  servicesCount: PropTypes.any,
};

PciMenu.defaultProps = {
  onExit: () => {},
  onSelectProject: () => {},
  projects: [],
  selectedProject: null,
  servicesCount: null,
};
