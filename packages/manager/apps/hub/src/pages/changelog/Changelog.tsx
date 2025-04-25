import { useContext, useState, useEffect } from 'react';
import { BaseLayout, HeadersProps } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  OsdsText,
  OsdsLink,
  OsdsIcon,
  OsdsBreadcrumb,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { EXTERNAL_LINKS } from '@/changelog.constants';

export default function Changelog() {
  const { t } = useTranslation('changelog');
  const { trackClick } = useOvhTracking();

  const header: HeadersProps = {
    title: t('changelog_title'),
  };
  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: '/',
      icon: ODS_ICON_NAME.HOME,
    },
    {
      label: t('changelog_title'),
      disabled: true,
    },
  ];

  const { shell, environment } = useContext(ShellContext);
  const isRegionUS = environment.getRegion() === 'US';

  const [isAccountSidebarVisible, setIsAccountSidebarVisible] = useState(false);

  useEffect(() => {
    const getIsAccountSidebarVisible = async () => {
      const newValueIsAccountSidebarVisible = (await shell.ux.isAccountSidebarVisible()) as boolean;
      setIsAccountSidebarVisible(() => newValueIsAccountSidebarVisible);
    };
    getIsAccountSidebarVisible();
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-auto border-box"
      data-testid="roadmap-changelog-page"
    >
      <div
        className={`hub-main ${
          isAccountSidebarVisible ? 'hub-main-view_sidebar_expanded' : ''
        }`}
      >
        <BaseLayout
          header={header}
          breadcrumb={<OsdsBreadcrumb items={breadcrumbItems} />}
        >
          <div className="grid gap-y-6">
            <div className="pt-6">
              <OsdsText
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._800}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {t('changelog_subtitle_1')}
              </OsdsText>
            </div>
            <div>
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                hue={ODS_TEXT_COLOR_HUE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('changelog_paragraph_1')}
              </OsdsText>
            </div>
            <div>
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                hue={ODS_TEXT_COLOR_HUE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('changelog_paragraph_2')}
              </OsdsText>
            </div>
            <div>
              <OsdsLink
                role="link"
                target={OdsHTMLAnchorElementTarget._blank}
                rel={OdsHTMLAnchorElementRel.external}
                color={ODS_THEME_COLOR_INTENT.primary}
                href={EXTERNAL_LINKS.CLOUD_CHANGELOG.url}
                data-testid="changelog-cloud-link"
                onClick={() => {
                  trackClick(EXTERNAL_LINKS.CLOUD_CHANGELOG.tracking);
                }}
              >
                {t(EXTERNAL_LINKS.CLOUD_CHANGELOG.label_key)}
                <span slot="end">
                  <OsdsIcon
                    name={ODS_ICON_NAME.EXTERNAL_LINK}
                    className="ml-1"
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </span>
              </OsdsLink>
            </div>
            {!isRegionUS && (
              <div>
                <OsdsLink
                  role="link"
                  target={OdsHTMLAnchorElementTarget._blank}
                  rel={OdsHTMLAnchorElementRel.external}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={EXTERNAL_LINKS.WEB_CHANGELOG.url}
                  onClick={() => {
                    trackClick(EXTERNAL_LINKS.WEB_CHANGELOG.tracking);
                  }}
                >
                  {t(EXTERNAL_LINKS.WEB_CHANGELOG.label_key)}
                  <span slot="end">
                    <OsdsIcon
                      name={ODS_ICON_NAME.EXTERNAL_LINK}
                      className="ml-1"
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  </span>
                </OsdsLink>
              </div>
            )}
            <div className="pt-6">
              <OsdsText
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._800}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {t('changelog_subtitle_2')}
              </OsdsText>
            </div>
            <div>
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                hue={ODS_TEXT_COLOR_HUE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('changelog_paragraph_3')}
              </OsdsText>
            </div>
            <div>
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                hue={ODS_TEXT_COLOR_HUE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('changelog_paragraph_4')}
              </OsdsText>
            </div>

            <div className="grid gap-y-6 grid-cols-1 xl:grid-cols-2 xl:gap-x-10">
              <div className="grid gap-y-6">
                {!isRegionUS && (
                  <>
                    <div className="pt-6">
                      <OsdsText
                        level={ODS_TEXT_LEVEL.heading}
                        size={ODS_TEXT_SIZE._400}
                        hue={ODS_TEXT_COLOR_HUE._800}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      >
                        {t('changelog_subtitle_4')}
                      </OsdsText>
                    </div>
                    <OsdsLink
                      role="link"
                      target={OdsHTMLAnchorElementTarget._blank}
                      rel={OdsHTMLAnchorElementRel.external}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      href={EXTERNAL_LINKS.WEB_ROADMAP.url}
                      onClick={() => {
                        trackClick(EXTERNAL_LINKS.WEB_ROADMAP.tracking);
                      }}
                    >
                      {t(EXTERNAL_LINKS.WEB_ROADMAP.label_key)}
                      <span slot="end">
                        <OsdsIcon
                          name={ODS_ICON_NAME.EXTERNAL_LINK}
                          className="ml-1"
                          size={ODS_ICON_SIZE.xxs}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      </span>
                    </OsdsLink>
                    <OsdsLink
                      role="link"
                      target={OdsHTMLAnchorElementTarget._blank}
                      rel={OdsHTMLAnchorElementRel.external}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      href={EXTERNAL_LINKS.DOMAIN_ROADMAP.url}
                      onClick={() => {
                        trackClick(EXTERNAL_LINKS.DOMAIN_ROADMAP.tracking);
                      }}
                    >
                      {t(EXTERNAL_LINKS.DOMAIN_ROADMAP.label_key)}
                      <span slot="end">
                        <OsdsIcon
                          name={ODS_ICON_NAME.EXTERNAL_LINK}
                          className="ml-1"
                          size={ODS_ICON_SIZE.xxs}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      </span>
                    </OsdsLink>
                    <OsdsLink
                      role="link"
                      target={OdsHTMLAnchorElementTarget._blank}
                      rel={OdsHTMLAnchorElementRel.external}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      href={EXTERNAL_LINKS.COLLAB_ROADMAP.url}
                      onClick={() => {
                        trackClick(EXTERNAL_LINKS.COLLAB_ROADMAP.tracking);
                      }}
                    >
                      {t(EXTERNAL_LINKS.COLLAB_ROADMAP.label_key)}
                      <span slot="end">
                        <OsdsIcon
                          name={ODS_ICON_NAME.EXTERNAL_LINK}
                          className="ml-1"
                          size={ODS_ICON_SIZE.xxs}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      </span>
                    </OsdsLink>
                  </>
                )}
                <div className="pt-6">
                  <OsdsText
                    level={ODS_TEXT_LEVEL.heading}
                    size={ODS_TEXT_SIZE._400}
                    hue={ODS_TEXT_COLOR_HUE._800}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  >
                    {t('changelog_subtitle_5')}
                  </OsdsText>
                </div>
                <OsdsLink
                  role="link"
                  target={OdsHTMLAnchorElementTarget._blank}
                  rel={OdsHTMLAnchorElementRel.external}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={EXTERNAL_LINKS.CLOUD_ROADMAP.url}
                  onClick={() => {
                    trackClick(EXTERNAL_LINKS.CLOUD_ROADMAP.tracking);
                  }}
                >
                  {t(EXTERNAL_LINKS.CLOUD_ROADMAP.label_key)}
                  <span slot="end">
                    <OsdsIcon
                      name={ODS_ICON_NAME.EXTERNAL_LINK}
                      className="ml-1"
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  </span>
                </OsdsLink>
                <OsdsLink
                  role="link"
                  target={OdsHTMLAnchorElementTarget._blank}
                  rel={OdsHTMLAnchorElementRel.external}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={EXTERNAL_LINKS.PUBLIC_CLOUD_ROADMAP.url}
                  onClick={() => {
                    trackClick(EXTERNAL_LINKS.PUBLIC_CLOUD_ROADMAP.tracking);
                  }}
                >
                  {t(EXTERNAL_LINKS.PUBLIC_CLOUD_ROADMAP.label_key)}
                  <span slot="end">
                    <OsdsIcon
                      name={ODS_ICON_NAME.EXTERNAL_LINK}
                      className="ml-1"
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  </span>
                </OsdsLink>
                <div>
                  <OsdsLink
                    role="link"
                    target={OdsHTMLAnchorElementTarget._blank}
                    rel={OdsHTMLAnchorElementRel.external}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    href={EXTERNAL_LINKS.INFRA_ROADMAP.url}
                    onClick={() => {
                      trackClick(EXTERNAL_LINKS.INFRA_ROADMAP.tracking);
                    }}
                  >
                    {t(EXTERNAL_LINKS.INFRA_ROADMAP.label_key)}
                    <span slot="end">
                      <OsdsIcon
                        name={ODS_ICON_NAME.EXTERNAL_LINK}
                        className="ml-1"
                        size={ODS_ICON_SIZE.xxs}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </OsdsLink>
                  <div>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      className="color-[var(--ods-color-default-500)]"
                    >
                      {t(
                        `changelog_infra_product_list${
                          isRegionUS ? '_us' : ''
                        }`,
                      )}
                    </OsdsText>
                  </div>
                </div>
                <div>
                  <OsdsLink
                    role="link"
                    target={OdsHTMLAnchorElementTarget._blank}
                    rel={OdsHTMLAnchorElementRel.external}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    href={EXTERNAL_LINKS.PRIVATE_CLOUD_ROADMAP.url}
                    onClick={() => {
                      trackClick(EXTERNAL_LINKS.PRIVATE_CLOUD_ROADMAP.tracking);
                    }}
                  >
                    {t(EXTERNAL_LINKS.PRIVATE_CLOUD_ROADMAP.label_key)}
                    <span slot="end">
                      <OsdsIcon
                        name={ODS_ICON_NAME.EXTERNAL_LINK}
                        className="ml-1"
                        size={ODS_ICON_SIZE.xxs}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </OsdsLink>
                  <div>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      className="color-[var(--ods-color-default-500)]"
                    >
                      {t(
                        `changelog_private_cloud_product_list${
                          isRegionUS ? '_us' : ''
                        }`,
                      )}
                    </OsdsText>
                  </div>

                  <OsdsLink
                    role="link"
                    target={OdsHTMLAnchorElementTarget._blank}
                    rel={OdsHTMLAnchorElementRel.external}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    href={EXTERNAL_LINKS.SECURITY_ROADMAP.url}
                    onClick={() => {
                      trackClick(EXTERNAL_LINKS.SECURITY_ROADMAP.tracking);
                    }}
                  >
                    {t(EXTERNAL_LINKS.SECURITY_ROADMAP.label_key)}
                    <span slot="end">
                      <OsdsIcon
                        name={ODS_ICON_NAME.EXTERNAL_LINK}
                        className="ml-1"
                        size={ODS_ICON_SIZE.xxs}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </OsdsLink>
                </div>
              </div>
              <div className="block p-8 mt-6 my-4 bg-[var(--ods-color-primary-075)]">
                <OsdsText
                  level={ODS_TEXT_LEVEL.heading}
                  size={ODS_TEXT_SIZE._400}
                  hue={ODS_TEXT_COLOR_HUE._800}
                  color={ODS_THEME_COLOR_INTENT.primary}
                >
                  {t('changelog_tile_title')}
                </OsdsText>
                <ul className="grid gap-y-4">
                  <li>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {t('changelog_tile_list_item_1')}
                    </OsdsText>
                  </li>
                  <li>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {t('changelog_tile_list_item_2')}{' '}
                      <OsdsLink
                        role="link"
                        target={OdsHTMLAnchorElementTarget._blank}
                        rel={OdsHTMLAnchorElementRel.external}
                        color={ODS_THEME_COLOR_INTENT.primary}
                        href={
                          isRegionUS
                            ? EXTERNAL_LINKS.HELPCENTER_US.url
                            : EXTERNAL_LINKS.HELPCENTER.url
                        }
                        onClick={() => {
                          trackClick(EXTERNAL_LINKS.BUG_BOUNTY.tracking);
                        }}
                      >
                        {t(EXTERNAL_LINKS.HELPCENTER.label_key)}{' '}
                        <span slot="end">
                          <OsdsIcon
                            name={ODS_ICON_NAME.EXTERNAL_LINK}
                            className="ml-1"
                            size={ODS_ICON_SIZE.xxs}
                            color={ODS_THEME_COLOR_INTENT.primary}
                          />
                        </span>
                      </OsdsLink>
                    </OsdsText>
                  </li>
                  <li>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {t('changelog_tile_list_item_3')}{' '}
                      <OsdsLink
                        role="link"
                        target={OdsHTMLAnchorElementTarget._blank}
                        rel={OdsHTMLAnchorElementRel.external}
                        color={ODS_THEME_COLOR_INTENT.primary}
                        href={EXTERNAL_LINKS.BUG_BOUNTY.url}
                        onClick={() => {
                          trackClick(EXTERNAL_LINKS.BUG_BOUNTY.tracking);
                        }}
                      >
                        {t(EXTERNAL_LINKS.BUG_BOUNTY.label_key)}
                        <span slot="end">
                          <OsdsIcon
                            name={ODS_ICON_NAME.EXTERNAL_LINK}
                            className="ml-1"
                            size={ODS_ICON_SIZE.xxs}
                            color={ODS_THEME_COLOR_INTENT.primary}
                          />
                        </span>
                      </OsdsLink>{' '}
                      {t('changelog_tile_list_item_3bis')}
                    </OsdsText>
                  </li>
                  <li>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {t('changelog_tile_list_item_4')}
                    </OsdsText>
                  </li>
                  <li>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {t('changelog_tile_list_item_5')}
                    </OsdsText>
                  </li>
                  <li>
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._400}
                      hue={ODS_TEXT_COLOR_HUE._400}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {t('changelog_tile_list_item_6')}
                    </OsdsText>
                  </li>
                </ul>
                <div>
                  <OsdsText
                    level={ODS_TEXT_LEVEL.body}
                    size={ODS_TEXT_SIZE._400}
                    hue={ODS_TEXT_COLOR_HUE._400}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {t('changelog_tile_paragraph')}
                  </OsdsText>
                </div>
              </div>
            </div>
          </div>
        </BaseLayout>
      </div>
    </div>
  );
}
