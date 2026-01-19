import { useMemo, useState } from 'react';

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsAccordion,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import { useParam } from '@ovh-ux/manager-pci-common';
import { ActionMenu, Clipboard, LinkType, Links } from '@ovh-ux/manager-react-components';

import { useClusterRestrictions, useOidcProvider } from '@/api/hooks/useKubernetes';
import { KUBECONFIG_URL, PROCESSING_STATUS } from '@/constants';
import { getValidOptionalKeys, isOptionalValue, isStandardPlan } from '@/helpers';
import { TKube } from '@/types';

import { ClusterConfigFileActions } from './ClusterConfigFileActions.component';
import TileLine from './TileLine.component';

export type ClusterAccessAndSecurityProps = {
  kubeDetail: TKube;
};

export default function ClusterAccessAndSecurity({
  kubeDetail,
}: Readonly<ClusterAccessAndSecurityProps>) {
  const { t } = useTranslation('service');

  const { kubeId, projectId } = useParam('projectId', 'kubeId');
  const [isOptional, setIsOptional] = useState(true);

  const hrefRestrictions = useHref('../restrictions');
  const hrefUAddOIDCProvider = useHref('./add-oidc-provider');
  const hrefUpdateOIDCProvider = useHref('./update-oidc-provider');
  const hrefRemoveOIDCProvider = useHref('./remove-oidc-provider');

  const { data: oidcProvider } = useOidcProvider(projectId, kubeId);
  const { data: clusterRestrictions, isPending: isRestrictionsPending } = useClusterRestrictions(
    projectId,
    kubeId,
  );

  const isOidcDefined = useMemo<boolean>(
    () => Boolean(oidcProvider?.clientId && oidcProvider?.issuerUrl),
    [oidcProvider],
  );

  const isProcessing = (status: string) => PROCESSING_STATUS.includes(status);

  const validOptionalKeys = useMemo(
    () => (oidcProvider ? getValidOptionalKeys(oidcProvider) : []),
    [oidcProvider],
  );
  const hasOptionalValues = validOptionalKeys.length > 0;

  const getClusterRestrictionLabel = (length?: number) => {
    const suffixes = ['no_count', 'one', 'count'];
    const len = length ?? 0;
    const suffix = suffixes[Math.min(len, 2)];
    return t(`kube_service_restrictions_${suffix}`, { count: len });
  };

  return (
    <OsdsTile className="w-full flex-col shadow-lg" inline rounded variant={ODS_TILE_VARIANT.ghost}>
      <div className="flex w-full flex-col">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('kube_service_access_security')}
        </OsdsText>
        <OsdsDivider separator />

        <TileLine
          title={t('kube_service_cluster_api_url')}
          value={<Clipboard aria-label="clipboard" value={kubeDetail?.url} />}
        />

        {kubeDetail.plan && !isStandardPlan(kubeDetail.plan) && (
          <TileLine
            title={t('service:kube_service_cluster_nodes_url')}
            value={<Clipboard aria-label="clipboard" value={kubeDetail.nodesUrl} />}
          />
        )}

        <TileLine
          title={t('kube_service_restrictions')}
          value={
            <>
              {isRestrictionsPending ? (
                <OsdsSkeleton />
              ) : (
                <OsdsText
                  className="mb-4 block"
                  data-testid="ClusterAccessAndSecurity-ClusterRestrictions"
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {getClusterRestrictionLabel(clusterRestrictions?.length)}
                </OsdsText>
              )}
              <Links
                href={hrefRestrictions}
                label={t('kube_service_restrictions_edit')}
                type={LinkType.next}
              />
            </>
          }
        />

        <OsdsPopover>
          <span slot="popover-trigger">
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._200}
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              onClick={(event) => event.stopPropagation()}
            >
              {t('kube_service_file')}
            </OsdsText>
            <OsdsIcon
              name={ODS_ICON_NAME.HELP}
              size={ODS_ICON_SIZE.xs}
              className="ml-4 cursor-help"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
          <OsdsPopoverContent>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} level={ODS_TEXT_LEVEL.body}>
              {t('kube_service_file_help')}
            </OsdsText>
            <Links
              tab-index="-1"
              label={t('kube_service_file_more_information')}
              type={LinkType.external}
              target={OdsHTMLAnchorElementTarget._blank}
              href={KUBECONFIG_URL}
            />
          </OsdsPopoverContent>
        </OsdsPopover>
        <ClusterConfigFileActions projectId={projectId} kubeDetail={kubeDetail} />

        <OsdsDivider separator />

        <TileLine
          title={
            <div className="flex items-center justify-between">
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('kube_service_access_security_oidc_title')}
              </OsdsText>

              <div className="ml-4 min-w-10">
                <ActionMenu
                  icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
                  aria-label={t('kube_service_access_security_oidc_menu_action_sr_only')}
                  isCompact
                  items={[
                    {
                      id: 1,
                      label: t('kube_service_access_security_oidc_menu_action_add_provider'),
                      disabled: isProcessing(kubeDetail?.status) || isOidcDefined,
                      href: hrefUAddOIDCProvider,
                    },
                    {
                      id: 2,
                      label: t('kube_service_access_security_oidc_menu_action_set_provider'),
                      disabled: isProcessing(kubeDetail?.status) || !isOidcDefined,
                      href: hrefUpdateOIDCProvider,
                    },
                    {
                      id: 3,
                      label: t('kube_service_access_security_oidc_menu_action_remove_provider'),
                      disabled: isProcessing(kubeDetail?.status) || !isOidcDefined,
                      href: hrefRemoveOIDCProvider,
                    },
                  ]}
                />
              </div>
            </div>
          }
          value={
            <div className="flex items-baseline justify-between">
              {isOidcDefined ? (
                <div className="w-full">
                  {oidcProvider && (
                    <Clipboard aria-label="clipboard" value={oidcProvider.issuerUrl} />
                  )}
                  <div className="mt-6">
                    <OsdsText
                      className="mr-2 font-semibold"
                      size={ODS_TEXT_SIZE._400}
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      Client ID :
                    </OsdsText>

                    <OsdsText
                      size={ODS_TEXT_SIZE._400}
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {oidcProvider?.clientId}
                    </OsdsText>
                  </div>

                  {hasOptionalValues && (
                    <div className="mt-6">
                      <OsdsAccordion onOdsAccordionToggle={() => setIsOptional(!isOptional)}>
                        <span slot="summary">
                          {isOptional
                            ? t('kube_service_show_optional')
                            : t('kube_service_hide_optional')}
                        </span>
                        <>
                          {oidcProvider &&
                            Object.entries(oidcProvider)
                              .filter(
                                ([key, value]) =>
                                  isOptionalValue(value) &&
                                  key !== 'issuerUrl' &&
                                  key !== 'clientId',
                              )
                              .map(([key, value]) => (
                                <div key={key} className="my-4 flex max-w-[400px] flex-col">
                                  <OsdsText
                                    className="font-semibold"
                                    size={ODS_TEXT_SIZE._200}
                                    level={ODS_TEXT_LEVEL.heading}
                                    color={ODS_THEME_COLOR_INTENT.text}
                                  >
                                    {key}
                                  </OsdsText>
                                  <OsdsText
                                    className="mb-4 truncate"
                                    size={ODS_TEXT_SIZE._400}
                                    level={ODS_TEXT_LEVEL.body}
                                    color={ODS_THEME_COLOR_INTENT.text}
                                  >
                                    {Array.isArray(value) ? value.join(', ') : value}
                                  </OsdsText>
                                </div>
                              ))}
                        </>
                      </OsdsAccordion>
                    </div>
                  )}
                </div>
              ) : (
                <OsdsText
                  className="mb-4"
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('kube_service_access_security_oidc_no_provider')}
                </OsdsText>
              )}
            </div>
          }
        />
        <TileLine
          title={t('kube_service_upgrade_policy')}
          value={
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(`kube_service_upgrade_policy_${kubeDetail?.updatePolicy}`)}
            </OsdsText>
          }
        />
      </div>
    </OsdsTile>
  );
}
