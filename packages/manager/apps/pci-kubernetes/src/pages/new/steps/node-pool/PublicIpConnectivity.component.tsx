import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Icon,
  TEXT_PRESET,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type PublicIpConnectivityProps = {
  price: string;
};

const PublicIpConnectivity = ({ price }: PublicIpConnectivityProps) => {
  const { t } = useTranslation('node-pool');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const publicIpExplanation = t(
    ovhSubsidiary === 'US'
      ? 'kube_common_node_pool_public_connetivity_us_tooltip'
      : 'kube_common_node_pool_public_connetivity_free_plan_tooltip',
  );

  return (
    <div className="max-w-3xl">
      <Text className="my-6 font-bold text-[--ods-color-text-500]" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_public_connetivity_title')}
      </Text>
      <div className="mb-6">
        <div className="flex gap-4">
          <Toggle withLabels disabled checked>
            <ToggleControl />
            <ToggleLabel className=" text-[--ods-color-text]" color="text">
              <span className="font-semibold">
                {t('kube_common_node_pool_public_connetivity_public_ip')}
              </span>
              <span> {` (${price} / ${t('kube_common_node_pool_node')})`}</span>
            </ToggleLabel>
          </Toggle>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex border-none bg-transparent p-0"
                aria-label={publicIpExplanation}
              >
                <Icon
                  className="cursor-help text-[1.3rem] text-[--ods-color-primary-500]"
                  name="circle-question"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[500px] p-4">
              <Text color="text">{publicIpExplanation}</Text>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default PublicIpConnectivity;
