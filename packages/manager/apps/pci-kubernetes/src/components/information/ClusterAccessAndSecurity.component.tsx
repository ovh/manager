import { ActionMenu, Links, LinkType } from '@ovhcloud/manager-components';
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
import {
  OsdsButton,
  OsdsClipboard,
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
import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { downloadContent } from '@/helpers';
import { CONFIG_FILENAME, KUBECONFIG_URL } from '@/constants';
import {
  useClusterRestrictions,
  useKubeDetail,
  useOidcProvider,
} from '@/api/hooks/useKubernetes';
import { getKubeConfig } from '@/api/data/kubernetes';
import TileLine from './TileLine.component';

export default function ClusterAccessAndSecurity() {
  const { t } = useTranslation('service');

  const [isKubeConfigPending, setIsKubeConfigPending] = useState(false);
  const { kubeId, projectId } = useParams();
  const hrefRestrictions = useHref('../restrictions');

  const { data: kubeDetail, isPending } = useKubeDetail(projectId, kubeId);
  const { data: oidcProvider } = useOidcProvider(projectId, kubeId);
  const {
    data: clusterRestrictions,
    isPending: isRestrictionsPending,
  } = useClusterRestrictions(projectId, kubeId);

  const isOidcDefined = useMemo<boolean>(() => {
    if (!oidcProvider) return false;

    const { clientId, issuerUrl } = oidcProvider;
    return Boolean(clientId && issuerUrl);
  }, [oidcProvider]);

  const downloadConfigFile = () => {
    setIsKubeConfigPending(true);
    getKubeConfig(projectId, kubeId)
      .then((config) =>
        downloadContent({
          fileContent: config.content,
          fileName: `${CONFIG_FILENAME}.yml`,
        }),
      )
      .catch((error) => console.error(error))
      .finally(() => setIsKubeConfigPending(false));
  };

  if (isPending) {
    return null;
  }

  return (
    <OsdsTile
      className="w-full h-full flex-col shadow-lg opacity-100"
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

        {/* Kube API URL */}
        <TileLine
          title={t('kube_service_cluster_api_url')}
          value={
            <OsdsClipboard aria-label="clipboard" value={kubeDetail.url} />
          }
        />

        {/* Limit access to APIServer */}
        <TileLine
          title={t('kube_service_restrictions')}
          value={
            <>
              {isRestrictionsPending ? (
                <OsdsSkeleton />
              ) : (
                <OsdsText
                  className="mb-4"
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {clusterRestrictions.length === 0 &&
                    t('kube_service_restrictions_no_count')}
                  {clusterRestrictions.length === 1 &&
                    t('kube_service_restrictions_one')}
                  {clusterRestrictions.length > 1 &&
                    t('kube_service_restrictions_count', {
                      count: clusterRestrictions.length,
                    })}
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

        {/* kube config file */}
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
              className="ml-4"
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
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={downloadConfigFile}
            {...(isKubeConfigPending ? { disabled: true } : {})}
            inline
          >
            {CONFIG_FILENAME}
          </OsdsButton>
          {isKubeConfigPending && (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
          )}
        </div>

        <OsdsDivider separator />

        {/* OIDC */}
        <TileLine
          title={t('kube_service_access_security_oidc_title')}
          value={
            <div className="flex items-center justify-between	">
              {isOidcDefined ? (
                <>
                  <OsdsClipboard
                    aria-label="clipboard"
                    value={oidcProvider.issuerUrl}
                  />
                  <OsdsText
                    className="mb-4"
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {oidcProvider.clientId}
                  </OsdsText>
                </>
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

              <ActionMenu
                aria-label="kube_service_access_security_oidc_menu_action_sr_only"
                isCompact
                items={[
                  {
                    id: 1,
                    label: t(
                      'kube_service_access_security_oidc_menu_action_add_provider',
                    ),
                    disabled: isOidcDefined,
                  },
                  {
                    id: 2,
                    label: t(
                      'kube_service_access_security_oidc_menu_action_set_provider',
                    ),
                    disabled: !isOidcDefined,
                  },
                  {
                    id: 3,
                    label: t(
                      'kube_service_access_security_oidc_menu_action_remove_provider',
                    ),
                    disabled: !isOidcDefined,
                  },
                ]}
              />
            </div>
          }
        />

        {/* upgrade policy */}
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
