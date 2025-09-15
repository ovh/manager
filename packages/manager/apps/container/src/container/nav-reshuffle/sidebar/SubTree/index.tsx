import { FocusEvent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import style from './style.module.scss';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';
import {
  findNodeById,
  shouldHideElement,
  getLastElement,
} from '@/container/nav-reshuffle/sidebar/utils';
import SubTreeSection from '@/container/nav-reshuffle/sidebar/SubTree/SubTreeSection';
import { PublicCloudPanel } from './PublicCloudPanel';
import useProductNavReshuffle from '@/core/product-nav-reshuffle/useProductNavReshuffle';

interface SubTreeProps {
  rootNode: Node;
  handleCloseSideBar(): void;
  handleOnSubMenuClick(node: Node): void;
  selectedNode: Node;
  open: boolean;
}

const SubTree = ({
  rootNode,
  handleOnSubMenuClick,
  selectedNode,
  handleCloseSideBar,
  open,
}: SubTreeProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const { isMobile, isAnimated } = useProductNavReshuffle();
  const [isOpen, setIsOpen] = useState(false);

  const [focusOnLast, setFocusOnLast] = useState<boolean>(false);
  const lastElement = getLastElement(rootNode);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsOpen(open);
    }, 10);
    return () => clearTimeout(timeOut);
  }, [open]);

  return (
    <div
      className={`${style.subtree_content} ${
        isOpen ? style.subtree_content_open : style.subtree_content_close
      } ${isAnimated && style.subtree_content_animated}`}
      onBlur={(e: FocusEvent<HTMLDivElement>) => {
        const id = e.relatedTarget?.id.replace('-link', '');
        if (id === lastElement.id) {
          setFocusOnLast(true);
          return;
        }
        if (focusOnLast) {
          const node = findNodeById(rootNode, id);
          if (node) {
            setFocusOnLast(false);
            return;
          }
          handleCloseSideBar();
        }
      }}
    >
      {!isMobile && (
        <button
          className={style.subtree_close}
          onClick={() => handleCloseSideBar()}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleCloseSideBar();
            }
          }}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.CLOSE}
            size={ODS_ICON_SIZE.sm}
            className="cursor-pointer text-white bg-white"
          />
        </button>
      )}

      <button
        className={style.subtree_back_btn}
        onClick={handleCloseSideBar}
        title={t('sidebar_back_menu')}
        role="button"
      >
        <span
          className={`oui-icon oui-icon-arrow-left mx-2`}
          aria-hidden="true"
        ></span>
        {t('sidebar_back_menu')}
      </button>
      {rootNode?.illustration && (
        <div
          aria-label={t(rootNode?.translation)}
          className={`d-block py-3 ${style.subtree_illustration}`}
          role="img"
        >
          <img
            src={rootNode?.illustration}
            alt={t(rootNode?.translation)}
            aria-hidden="true"
          />
        </div>
      )}

      <div className={rootNode?.illustration ? '' : 'pt-4'}>
        <ul
          className={`${style.subtree_list}`}
          role="menu"
          aria-label={t(rootNode?.translation)}
        >
          <li className="mb-4 px-3">
            <h2>{t(rootNode?.translation)}</h2>
          </li>

          {rootNode?.id.startsWith('pci') ? (
            <PublicCloudPanel
              rootNode={rootNode}
              selectedNode={selectedNode}
              handleOnSubMenuClick={handleOnSubMenuClick}
            />
          ) : (
            rootNode?.children
              ?.filter((childNode) => !shouldHideElement(childNode, childNode.hasService ?? true))
              .map((node) => (
                <li
                  key={node.id}
                  id={node.id}
                  className={style.sidebar_pciEntry}
                >
                  <SubTreeSection
                    node={node}
                    selectedNode={selectedNode}
                    handleOnSubMenuClick={handleOnSubMenuClick}
                  />
                  {node.separator && <hr role="separator" />}
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default SubTree;
