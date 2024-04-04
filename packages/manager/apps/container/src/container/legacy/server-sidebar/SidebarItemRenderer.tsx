import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLegacyContainer } from '@/container/legacy/context';
import { SidebarMenuItem } from './sidebarMenu';
import style from './index.module.scss';
import {
  OsdsSpinner,
  OsdsLink,
  OsdsText,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';

import {
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

function ServerSidebarSearchField({
  item,
  onUpdate,
}: {
  item: SidebarMenuItem;
  onUpdate: (value: string) => void;
}) {
  const [, setSearch] = useState(item.searchField);
  const { t } = useTranslation('sidebar');
  return (
    <div className={style.searchField}>
      <i className="ovh-font ovh-font-search" aria-hidden="true"></i>
      <input
        type="search"
        className="oui-input"
        placeholder={t('sidebar_search')}
        value={item.searchField}
        onChange={(e) => {
          setSearch(e.target.value);
          item.searchField = e.target.value;
          item.parent.searchQuery = e.target.value;
          onUpdate(e.target.value);
        }}
      ></input>
    </div>
  );
}

export default function ServerSidebarItemRenderer({
  item,
  onToggle,
  onSearch,
}: {
  item: SidebarMenuItem;
  onToggle: (item: SidebarMenuItem) => void;
  onSearch: (item: SidebarMenuItem) => void;
}) {
  const { t } = useTranslation('sidebar');
  const { setIsResponsiveSidebarMenuOpen } = useLegacyContainer();
  const hasToggle = item.loader || item.subItems?.length > 0;
  const updateHandler = useCallback(() => onSearch(item), [item, onSearch]);
  const [isClicked, setIsClicked] = useState(false);
  let itemRender = null;

  let linkColor = item.isSelected ? ODS_THEME_COLOR_INTENT.primary : ODS_THEME_COLOR_INTENT.text

  const handleClick = () => {
    setIsClicked(!isClicked);
    onToggle(item);
  };
  if ('searchField' in item) {
    itemRender = (
      <ServerSidebarSearchField item={item} onUpdate={updateHandler} />
    );
  } else if (item.isNoResultField) {
    itemRender = <div>{t('sidebar_no_result')}</div>;
  } else if (hasToggle) {
    const chevron = item.isOpen
      ? ODS_ICON_NAME.CHEVRON_DOWN
      : ODS_ICON_NAME.CHEVRON_RIGHT;
    let iconOrSpinner;

    if (item.loadingError) {
      iconOrSpinner = (
        <OsdsIcon
          name={ODS_ICON_NAME.ERROR_CIRCLE}
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.text}
        />
      );
    } else if (item.isLoading) {
      iconOrSpinner = <OsdsSpinner size={ODS_SPINNER_SIZE.sm} inline />;
    } else {
      iconOrSpinner = (
        <OsdsIcon
          name={chevron}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.text}
          className="align-middle"
        />
      );
    }

    itemRender = (
      <button
        className={`bg-transparent border-none p-0 m-0 cursor-pointer w-full text-left`}
        onClick={handleClick}
      >
        <span className={style.itemLineAlign}>
          {iconOrSpinner}
          <span className="pl-2 align-middle" aria-hidden="true">
            {item.icon}
            <span className="pl-2">{item.depth === 0 ? (
              <OsdsText
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._200}
              >
                {item.label}
              </OsdsText>
            ) : (
              <>
                <OsdsText
                  level={ODS_TEXT_LEVEL.button}
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._300}
                >
                  {item.label}
                </OsdsText>
                {item?.badge && (
                  <span
                    className={`oui-badge oui-badge_s oui-badge_${item.badge} ${style.menuBadge}`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}</span>
          </span>
        </span>
      </button>
    );
  } else {
    const additionalLinkProps = item.isExternal
      ? {
          target: OdsHTMLAnchorElementTarget._blank,
          rel: OdsHTMLAnchorElementRel.noopener,
        }
      : {};
    itemRender = (
      <span className="flex items-center pl-8">
        <span
          className=" pl-1 block float-left pl-15 h-menu-row-height leading-menu-row-height text-center pr-2"
          aria-hidden="true"
        >
          {item.icon}
        </span>
        <OsdsLink
          {...additionalLinkProps}
          role="treeitem"
          color={linkColor}
          href={item.href || '#'}
          onClick={() => {
            setIsResponsiveSidebarMenuOpen(false);
            handleClick();
          }}
          className="flex items-center whitespace-nowrap"
        >
          {item.depth === 0 ? (
            <OsdsText
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._200}
            >
              <span>{item.label}</span>
            </OsdsText>
          ) : (
            <span className={item.isSelected ? 'font-bold' : 'font-normal'}>
              {item.label}
            </span>
          )}
          {item?.badge && (
            <span className={`oui-badge oui-badge_s oui-badge_${item.badge}`}>
              {item.badge}
            </span>
          )}
        </OsdsLink>
      </span>
    );
  }
  return (
    <div
      className={`leading-menu-row-height ${item.depth > 0 ? 'pl-2' : ''} ${
        item.isOpen ? 'h-menu-row-height bg-white relative' : 'relative'
      }`}
    >
      <div
        className={
          item.depth > 0 ? 'border-l-3 border-blue-600 box-border' : ''
        }
      >
        <div
          className={item.isSelected ? style.menuItemSelected : ''}
          style={{
            paddingLeft: `${item.depth * 1.5 -
              (item.depth === 1 ? 0.5 : 0)}rem`,
          }}
        >
          {itemRender}
        </div>
      </div>
    </div>
  );
}
