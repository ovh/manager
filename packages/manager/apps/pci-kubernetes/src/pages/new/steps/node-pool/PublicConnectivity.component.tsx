import { useContext } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import {
  Icon,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TEXT_PRESET,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { IAM_AUTHENTICATION_INFOS, IAM_AUTHENTICATION_INFOS_PRICE } from '@/constants';

type PublicConnectivityProps = {
  disabled?: boolean;
  checked: boolean;
  onChange: (publicConnectivity: boolean) => void;
  price: { hourFormatted: string | null; monthFormatted: string | null } | null;
};

const PublicConnectivity = ({
  disabled = false,
  checked,
  onChange,
  price,
}: PublicConnectivityProps) => {
  const { t } = useTranslation('node-pool');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const priceDoc =
    IAM_AUTHENTICATION_INFOS_PRICE[ovhSubsidiary as keyof typeof IAM_AUTHENTICATION_INFOS_PRICE] ??
    IAM_AUTHENTICATION_INFOS_PRICE.DEFAULT;

  const ipDoc =
    IAM_AUTHENTICATION_INFOS[ovhSubsidiary as keyof typeof IAM_AUTHENTICATION_INFOS] ??
    IAM_AUTHENTICATION_INFOS.DEFAULT;

  return (
    <div className="max-w-3xl">
      <Text className="text-[--ods-color-text-500] my-6" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_public_connetivity_title')}
      </Text>
      <div className="mb-6">
        <div className="flex gap-4">
          <Popover>
            <Toggle
              withLabels
              disabled={disabled}
              checked={checked}
              onCheckedChange={(detail) => onChange(detail.checked)}
            >
              <ToggleControl />
              <ToggleLabel className="font-semibold text-[--ods-color-text]" color="text">
                {t('kube_common_node_pool_public_connetivity_toggle')}
              </ToggleLabel>
            </Toggle>
            <PopoverTrigger asChild>
              <Icon
                className="cursor-help text-[--ods-color-primary-500] text-[1.3rem]"
                name="circle-question"
              />
            </PopoverTrigger>
            <PopoverContent className="p-4 max-w-[500px]">
              <div className="p-6">
                <Text className="ml-4" color="text">
                  <Trans
                    ns="node-pool"
                    components={{
                      strong: <strong />,
                    }}
                    i18nKey="kube_common_node_pool_deploy_floating_ip_content1"
                  />
                </Text>
                <ul>
                  <li>
                    <Trans
                      ns="node-pool"
                      components={{
                        strong: <strong />,
                      }}
                      i18nKey="kube_common_node_pool_deploy_floating_ip_content2"
                    />
                  </li>
                  <li>
                    <Trans
                      ns="node-pool"
                      components={{
                        a: <Link target="_blank" href={ipDoc} />,
                      }}
                      i18nKey="kube_common_node_pool_deploy_floating_ip_content3"
                    />
                  </li>
                  <li>{t('kube_common_node_pool_deploy_floating_ip_content4')}</li>
                </ul>
                <Text className="font-bold">
                  <Icon name="triangle-exclamation" className="inline-block mr-2" />
                  {t('kube_common_node_pool_public_connectivity_warning_title')}
                </Text>
                <Text color="text">
                  <Trans
                    ns="node-pool"
                    components={{ strong: <strong /> }}
                    i18nKey="kube_common_node_pool_public_connectivity_warning_description_rolling"
                  />
                </Text>
                <Text color="text">
                  <Trans
                    ns="node-pool"
                    i18nKey="kube_common_node_pool_public_connectivity_warning_description_in_place"
                    components={{ strong: <strong /> }}
                  />
                </Text>
                <Text>
                  <Trans
                    ns="node-pool"
                    i18nKey={'kube_common_node_pool_public_connectivity_warning_description_more'}
                    components={{
                      strong: <strong />,
                      a: <Link target="_blank" href={priceDoc} />,
                    }}
                  />
                </Text>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {price && (
          <Text className="text-sm">
            {price.hourFormatted} / {t('kube_common_node_pool_node')}
          </Text>
        )}
      </div>
    </div>
  );
};

export default PublicConnectivity;
