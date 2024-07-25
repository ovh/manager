import style from './style.module.scss';
import { useTranslation } from 'react-i18next';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';
import {
  isMobile,
  shouldHideElement,
} from '@/container/nav-reshuffle/sidebar/utils';
import SubTreeSection from '@/container/nav-reshuffle/sidebar/SubTree/SubTreeSection';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { PublicCloudPanel } from './PublicCloudPanel';

interface SubTreeProps {
  rootNode: Node;
  handleBackNavigation(): void;
  handleCloseSideBar(): void;
  handleOnSubMenuClick(node: Node): void;
  selectedNode: Node;
}

const SubTree = ({
  rootNode,
  handleBackNavigation,
  handleOnSubMenuClick,
  selectedNode,
  handleCloseSideBar,
}: SubTreeProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const mobile = isMobile();

  return (
    <div
      className={style.subtree_content}
    >
      {!mobile && (
        <div className="flex justify-end p-2">
          <OsdsIcon
            name={ODS_ICON_NAME.CLOSE}
            size={ODS_ICON_SIZE.sm}
            className="cursor-pointer text-white bg-white"
            onClick={() => handleCloseSideBar()}
          />
        </div>
      )}

      <button className={style.subtree_back_btn} onClick={handleBackNavigation}>
        <span
          className={`oui-icon oui-icon-arrow-left mx-2`}
          aria-hidden="true"
        ></span>
        {t('sidebar_back_menu')}
      </button>
      {rootNode.illustration && (
        <div
          aria-label={t(rootNode.translation)}
          className={`d-block py-3 ${style.subtree_illustration}`}
        >
          <img
            src={rootNode.illustration}
            alt={t(rootNode.translation)}
            aria-hidden="true"
          />
        </div>
      )}

      <div className={rootNode.illustration ? '' : 'pt-4'}>
        <ul className={`${style.subtree_list}`}>
          <li className="mb-4 px-3">
            <h2>{t(rootNode.translation)}</h2>
          </li>

          {rootNode.id.startsWith('pci') ? (
            <PublicCloudPanel
              rootNode={rootNode}
              selectedNode={selectedNode}
              handleOnSubMenuClick={handleOnSubMenuClick}
            />
          ) : rootNode.children?.map((node) => (
            <li key={node.id} id={node.id} className={style.sidebar_pciEntry}>
              {!shouldHideElement(node, 1) && (
                <SubTreeSection
                  node={node}
                  selectedNode={selectedNode}
                  handleOnSubMenuClick={handleOnSubMenuClick}
                />
              )}
              {node.separator && <hr />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubTree;
