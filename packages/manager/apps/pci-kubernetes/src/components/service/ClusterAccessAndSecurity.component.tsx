import { ResponseAPIError } from '@ovh-ux/manager-pci-common';
import {
  ActionMenu,
  Links,
  LinkType,
  useNotifications,
} from '@ovhcloud/manager-components';
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
import { useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { TKube } from '@/types';
import { downloadContent } from '@/helpers';
import {
  CONFIG_FILENAME,
  KUBE_INSTALLING_STATUS,
  KUBECONFIG_URL,
} from '@/constants';
import {
  useClusterRestrictions,
  useKubeConfig,
  useOidcProvider,
} from '@/api/hooks/useKubernetes';
import TileLine from './TileLine.component';

export type ClusterAccessAndSecurityProps = {
  kubeDetail: TKube;
};

export default function ClusterAccessAndSecurity({
  kubeDetail,
}: Readonly<ClusterAccessAndSecurityProps>) {
  const { t } = useTranslation('service');
  const { t: tCommon } = useTranslation('common');

  const { kubeId, projectId } = useParams();
  const { addError } = useNotifications();

  const hrefRestrictions = useHref('../restrictions');
  const hrefAddOIDCProvider = useHref('./add-oidc-provider');
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
    onError: (error: ResponseAPIError) =>
      addError(
        <Translation ns="service">
          {(_t) =>
            _t('kube_service_file_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      ),
  });

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
          value={
            <OsdsClipboard
              aria-label="clipboard"
              value={kubeDetail?.url}
              data-testid="clusterAccessAndSecurity-kubeUrl"
            >
              <span slot="success-message">
                {tCommon('common_clipboard_copied')}
              </span>
            </OsdsClipboard>
          }
        />

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
          title={t('kube_service_access_security_oidc_title')}
          value={
            <div className="flex items-center justify-between">
              {isOidcDefined ? (
                <div className="w-fit">
                  <OsdsClipboard
                    aria-label="clipboard"
                    value={oidcProvider.issuerUrl}
                    data-testid="ClusterAccessAndSecurity-ClipboardIssuerUrl"
                    className="block"
                  >
                    <span slot="success-message">
                      {tCommon('common_clipboard_copied')}
                    </span>
                  </OsdsClipboard>
                  <OsdsText
                    className="mb-4 block"
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {oidcProvider.clientId}
                  </OsdsText>
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

              <div className="min-w-10">
                <ActionMenu
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
                      disabled: isOidcDefined,
                      href: hrefAddOIDCProvider,
                    },
                    {
                      id: 2,
                      label: t(
                        'kube_service_access_security_oidc_menu_action_set_provider',
                      ),
                      disabled: !isOidcDefined,
                      href: hrefUpdateOIDCProvider,
                    },
                    {
                      id: 3,
                      label: t(
                        'kube_service_access_security_oidc_menu_action_remove_provider',
                      ),
                      disabled: !isOidcDefined,
                      href: hrefRemoveOIDCProvider,
                    },
                  ]}
                />
              </div>
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
