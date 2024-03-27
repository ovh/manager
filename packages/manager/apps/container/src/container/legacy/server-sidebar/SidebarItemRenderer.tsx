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
} from '@ovhcloud/ods-stencil/components/react';
import {
  OdsSpinnerSize,
  OdsIconName,
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
  OdsTextLevel,
  OdsIconSize,
  OdsTextSize,
} from '@ovhcloud/ods-core';

import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

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

  let linkColor = OdsThemeColorIntent.text;
  if (item.isSelected) {
    linkColor = OdsThemeColorIntent.primary;
  }

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

    const chevron = item.isOpen ? OdsIconName.CHEVRON_DOWN : OdsIconName.CHEVRON_RIGHT;
    let iconOrSpinner;

    if (item.loadingError) {
      iconOrSpinner = (
        <OsdsIcon
          name={OdsIconName.ERROR_CIRCLE}
          size={OdsIconSize.sm}
          color={OdsThemeColorIntent.text}
        />

      );
    } else if (item.isLoading) {
      iconOrSpinner = <OsdsSpinner size={OdsSpinnerSize.sm} />;
    } else {
      iconOrSpinner = (
        <OsdsIcon
          name={chevron}
          size={OdsIconSize.xs}
          color={OdsThemeColorIntent.text}
          className={style.spinnerLoadingItem}
        />
      );
    }

    itemRender = (
      <button className={style.transparentButton} onClick={handleClick}>
        <span className={style.itemLineAlign}>
          {iconOrSpinner}
          <span className={style.iconPadding} aria-hidden="true">
            {item.icon}
            <span className={style.textPadding}>{item.depth === 0 ? (
              <OsdsText
                level={OdsTextLevel.heading}
                color={OdsThemeColorIntent.text}
                size={OdsTextSize._200}
              >
                {item.label}
              </OsdsText>
            ) : (
              <>
                <OsdsText
                  level={OdsTextLevel.button}
                  color={OdsThemeColorIntent.text}
                  size={OdsTextSize._300}
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

      <span className={style.itemLink}>
        <span className={style.menuItemIcon} aria-hidden="true">
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
          className={style.link}
        >
          {item.depth === 0 ? <OsdsText
            level={OdsTextLevel.heading}
            color={OdsThemeColorIntent.text}
            size={OdsTextSize._200}
          >
            <span>{item.label}</span>
          </OsdsText> : <span className={item.isSelected ? style.linkTextSelected : style.linkText}>{item.label}</span>}
          {item?.badge && (
            <span
              className={`oui-badge oui-badge_s oui-badge_${item.badge} ${style.menuBadge}`}
            >
              {item.badge}
            </span>
          )}
        </OsdsLink>

      </span>
    );
  }
  return (
    <div className={`${style.menuItem} ${item.depth > 0 ? 'pl-2' : ''} ${item.isOpen ? style.sticky : style.noSticky}`}>
      <div className={item.depth > 0 ? style.menuItemBorder : ''}>
        <div
          className={item.isSelected ? style.menuItemSelected : ''}
          style={{
            paddingLeft: `${item.depth * 1.5 - (item.depth === 1 ? 0.5 : 0)}rem`,
          }}
        >
          {itemRender}
        </div>
      </div>
    </div>
  );
}
