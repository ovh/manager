import {
  ActionMenu,
  Clipboard,
  Links,
  LinkType,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import { isApiCustomError } from '@ovh-ux/manager-core-api';
import { useParam } from '@ovh-ux/manager-pci-common';
import {
  OsdsAccordion,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSkeleton,
  OsdsSpinner,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useMemo, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TKube } from '@/types';

import {
  downloadContent,
  getValidOptionalKeys,
  isMultiDeploymentZones,
  isOptionalValue,
} from '@/helpers';
import {
  CONFIG_FILENAME,
  KUBE_INSTALLING_STATUS,
  KUBECONFIG_URL,
  PROCESSING_STATUS,
} from '@/constants';
import {
  useClusterRestrictions,
  useKubeConfig,
  useOidcProvider,
} from '@/api/hooks/useKubernetes';
import TileLine from './TileLine.component';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';

export type ClusterAccessAndSecurityProps = {
  kubeDetail: TKube;
};

export default function ClusterAccessAndSecurity({
  kubeDetail,
}: Readonly<ClusterAccessAndSecurityProps>) {
  const { t } = useTranslation('service');

  const { kubeId, projectId } = useParam('projectId', 'kubeId');
  const { addError } = useNotifications();
  const [isOptional, setIsOptional] = useState(true);

  const hrefRestrictions = useHref('../restrictions');
  const hrefUAddOIDCProvider = useHref('./add-oidc-provider');
  const hrefUpdateOIDCProvider = useHref('./update-oidc-provider');
  const hrefRemoveOIDCProvider = useHref('./remove-oidc-provider');

  const { data: oidcProvider } = useOidcProvider(projectId, kubeId);
  const {
    data: clusterRestrictions,
    isPending: isRestrictionsPending,
  } = useClusterRestrictions(projectId, kubeId);

  const isOidcDefined = useMemo<boolean>(
    () => Boolean(oidcProvider?.clientId && oidcProvider?.issuerUrl),
    [oidcProvider],
  );

  const { postKubeConfig, isPending: isKubeConfigPending } = useKubeConfig({
    projectId,
    kubeId,
    onSuccess: (config) =>
      downloadContent({
        fileContent: config.content,
        fileName: `${CONFIG_FILENAME}.yml`,
      }),
    onError: (error: Error) =>
      addError(
        <Translation ns="service">
          {(_t) =>
            _t('kube_service_file_error', {
              message: isApiCustomError(error)
                ? error?.response?.data?.message
                : error?.message ?? null,
            })
          }
        </Translation>,
        true,
      ),
  });
  const isProcessing = (status: string) => PROCESSING_STATUS.includes(status);
  const { data: regionInformations } = useRegionInformations(
    projectId,
    kubeDetail?.region,
  );

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
    <OsdsTile
      className="flex-col w-full shadow-lg"
      inline
      rounded
      variant={ODS_TILE_VARIANT.ghost}
    >
      <div className="flex flex-col w-full">
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

        {regionInformations?.type &&
          !isMultiDeploymentZones(regionInformations.type) && (
            <TileLine
              title={t('service:kube_service_cluster_nodes_url')}
              value={
                <Clipboard aria-label="clipboard" value={kubeDetail.nodesUrl} />
              }
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
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
            >
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
        <div className="flex items-center gap-5">
          <OsdsButton
            className="hover:shadow-lg w-fit"
            color={ODS_THEME_COLOR_INTENT.primary}
            data-testid="ClusterAccessAndSecurity-DownloadKubeConfig"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={postKubeConfig}
            {...(isKubeConfigPending ||
            kubeDetail?.status === KUBE_INSTALLING_STATUS
              ? { disabled: true }
              : {})}
            inline
          >
            {CONFIG_FILENAME}
          </OsdsButton>
          {isKubeConfigPending && (
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.sm}
              data-testid="clusterAccessAndSecurity-spinnerKubeConfig"
            />
          )}
        </div>

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

              <div className="min-w-10 ml-4">
                <ActionMenu
                  icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
                  aria-label={t(
                    'kube_service_access_security_oidc_menu_action_sr_only',
                  )}
                  isCompact
                  items={[
                    {
                      id: 1,
                      label: t(
                        'kube_service_access_security_oidc_menu_action_add_provider',
                      ),
                      disabled:
                        isProcessing(kubeDetail?.status) || isOidcDefined,
                      href: hrefUAddOIDCProvider,
                    },
                    {
                      id: 2,
                      label: t(
                        'kube_service_access_security_oidc_menu_action_set_provider',
                      ),
                      disabled:
                        isProcessing(kubeDetail?.status) || !isOidcDefined,
                      href: hrefUpdateOIDCProvider,
                    },
                    {
                      id: 3,
                      label: t(
                        'kube_service_access_security_oidc_menu_action_remove_provider',
                      ),
                      disabled:
                        isProcessing(kubeDetail?.status) || !isOidcDefined,
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
                    <Clipboard
                      aria-label="clipboard"
                      value={oidcProvider.issuerUrl}
                    />
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
                      <OsdsAccordion
                        onOdsAccordionToggle={() => setIsOptional(!isOptional)}
                      >
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
                                <div
                                  key={key}
                                  className="mb-4 mt-4 flex flex-col max-w-[400px]"
                                >
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
                                    {Array.isArray(value)
                                      ? value.join(', ')
                                      : value}
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
