import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useLegacyContainer } from '@/container/legacy/context';
import { useShell } from '@/context';
import useProjects from './useProjects';
import { features, getPciProjectMenu } from './pci-menu';
import style from './pci-sidebar.module.scss';

import ProjectIdCopy from './ProjectIdCopy';
import ProjectCreateButton from './ProjectCreateButton';

export default function PublicCloudSidebar() {
  const location = useLocation();
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');
  const { t } = useTranslation('pci-sidebar');
  const { setIsResponsiveSidebarMenuOpen } = useLegacyContainer();
  const { currentProject, projects } = useProjects();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const region = shell
    .getPlugin('environment')
    .getEnvironment()
    .getRegion();
  const projectId = currentProject?.project_id;

  const {data: availability } = useFeatureAvailability(features);

  const menu = useMemo(() => {
    if (!availability) return [];
    const menuItems = getPciProjectMenu(projectId, region, availability, (...args):string =>
      navigation.getURL(...args),
    );
    return menuItems
      .map((item) => ({
        ...item,
        subItems: item.subItems
          ?.map((item) => ({
            ...item,
            selected:
              location?.pathname?.indexOf(item.href?.replace(/^.*#/, '')) >= 0,
          })),
      }))
      .filter((menu) => menu.subItems?.length > 0);
  }, [availability, location, projectId, navigation]);

  const onShowAllProjectClick = useCallback(() => setShowAllProjects(true), []);
  const onHideAllProjectClick = useCallback(() => {
    setShowAllProjects(false);
    setIsResponsiveSidebarMenuOpen(false);
  }, []);

  const onCreateProjectClick = useCallback(() => {
    shell
      .getPlugin('tracking')
      .trackClick({
        name: 'public-cloud_project-listing_create-instance',
        type: 'action',
      });
  }, [shell]);

  const onMenuItemClick = useCallback(
    (id: string) => () => {
      shell.getPlugin('tracking').trackClick({
        name: `public-cloud_menu_${id}`,
        type: 'action',
      });
      setIsResponsiveSidebarMenuOpen(false);
    },
    [shell],
  );

  useEffect(() => {
    if (!showAllProjects) {
      setProjectSearchQuery('');
    }
  }, [showAllProjects]);

  if (!currentProject || !menu) {
    return <></>;
  }

  return (
    <>
      <div
        className={`${style.menuDrawer} ${
          showAllProjects ? style.menuDrawerOpen : ''
        }`}
      >
        <div className="d-flex m-2">
          <button
            type="button"
            className={style.menuToggleBack}
            onClick={onHideAllProjectClick}
          >
            <span className="oui-icon oui-icon-chevron-left"></span>
          </button>
          <h2 className={`${style.projectTitle} ${style.whiteText} ml-2`}>
            {currentProject?.description}
          </h2>
        </div>

        <ProjectIdCopy
          id="copy-alt"
          projectId={currentProject?.project_id}
          altStyle={true}
        />
        <ProjectCreateButton onClick={onCreateProjectClick} altStyle={true} />

        <h2 className={`${style.projectListTitle}`}>
          {t('sidebar_pci_project_list')}
        </h2>

        <a
          className={`oui-button oui-button_secondary m-2 d-block ${style.whiteButtonSecondary}`}
          href={navigation.getURL('public-cloud', '#/pci/projects')}
          onClick={onHideAllProjectClick}
        >
          <span>{t('sidebar_pci_project_all')}</span>
        </a>

        <div className={style.projectSearch}>
          <i className="ovh-font ovh-font-search" aria-hidden="true"></i>
          {projectSearchQuery && (
            <button
              className="d-block"
              onClick={() => setProjectSearchQuery('')}
            >
              <i
                className={`${style.projectSearchCancel} oui-icon oui-icon-close`}
                aria-hidden="true"
              ></i>
            </button>
          )}
          <input
            type="search"
            className="oui-input"
            placeholder={t('sidebar_pci_project_search')}
            value={projectSearchQuery}
            onChange={(e) => {
              setProjectSearchQuery(e.target.value);
            }}
          ></input>
        </div>

        {projects
          ?.filter((project) => {
            if (projectSearchQuery) {
              return (
                (project.description || project.project_id)
                  ?.toLowerCase()
                  .indexOf(projectSearchQuery.trim()) >= 0
              );
            }
            return true;
          })
          .map((project) => (
            <a
              key={project.project_id}
              className={`${style.projectLink}`}
              href={navigation.getURL(
                'public-cloud',
                `#/pci/projects/${project.project_id}`,
              )}
              onClick={onHideAllProjectClick}
            >
              <span>{project.description}</span>
              <span
                className={`oui-icon oui-icon-chevron-right ${style.whiteText}`}
              ></span>
            </a>
          ))}
      </div>

      <div style={{ height: '100%', overflow: 'scroll' }}>
        <div className="d-flex m-2">
          <h2 className={style.projectTitle}>{currentProject?.description}</h2>
            <button
              type="button"
              className={style.menuToggle}
              onClick={onShowAllProjectClick}
            >
              <span className="oui-icon oui-icon-chevron-right"></span>
            </button>
        </div>

        <ProjectIdCopy id="copy" projectId={currentProject?.project_id} />
        <ProjectCreateButton onClick={onCreateProjectClick} />

        {menu.map((item) => (
          <div className="m-2" key={item.id}>
            <h2 className={style.menuTitle}>
             {item.title}
             {item.badge && (
                        <span
                          className={`oui-badge oui-badge_s oui-badge_${item.badge} ${style.menuBadge}`}
                        >
                          {item.badge}
                        </span>
                      )}</h2>
            {item.subItems?.length > 0 && (
              <ul className={style.menuUl}>
                {item.subItems.map((subItem) => (
                  <li key={`${item.id}-${subItem.id}`}>
                    <a
                      className={`${style.menuLink} ${
                        subItem.selected ? style.menuLinkSelected : ''
                      }`}
                      href={subItem.href}
                      onClick={onMenuItemClick(subItem.id)}
                      {...(subItem.external
                        ? {
                            target: '_blank',
                          }
                        : {})}
                    >
                      <span>
                        {subItem.title}
                        {subItem.external && (
                          <span
                            className={`oui-icon oui-icon-external-link ${style.externalIcon}`}
                          ></span>
                        )}
                      </span>
                      {subItem?.badge && (
                        <span
                          className={`oui-badge oui-badge_s oui-badge_${subItem.badge} ${style.menuBadge}`}
                        >
                          {subItem.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
