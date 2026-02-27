import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Link,
  Skeleton,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { useNotifications } from '@ovh-ux/muk';

import { useVrackTasksContext } from '@/contexts/vrack-tasks/useVrackTasks';
import { useGetUser } from '@/hooks/useGetUser';
import { getVrackIpv6BridgedSubrangeDetailKey } from '@/hooks/vrack-ip/ipv6/useGetBridgedSubranges';
import { useUpdateBridgedSubrange } from '@/hooks/vrack-ip/ipv6/useUpdateBridgedSubrange';
import { GUIDE_LINKS, TRANSLATION_NAMESPACES } from '@/utils/constants';

type SlaacTogglerProps = {
  serviceName: string;
  ipv6: string;
  bridgedSubrange: string;
  value: 'enabled' | 'disabled';
};

export const SlaacToggler = ({ serviceName, ipv6, bridgedSubrange, value }: SlaacTogglerProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.publicIpRouting);
  const { addError, clearNotifications } = useNotifications();
  const [isUpdatingSlaac, setIsUpdatingSlaac] = useState<boolean>(false);
  const { trackTask } = useVrackTasksContext();
  const queryClient = useQueryClient();
  const { user } = useGetUser();

  const subsidiary = user?.ovhSubsidiary as keyof typeof GUIDE_LINKS;
  const subsidiaryGuideLink: {
    link1: string;
    link2: string;
    link3?: string;
    link4?: string;
    slaac?: string;
  } = GUIDE_LINKS[subsidiary];
  const slaacLink: string = subsidiaryGuideLink?.slaac || GUIDE_LINKS.DEFAULT.slaac;

  const { mutate: updateBridgedSubrange } = useUpdateBridgedSubrange({
    serviceName,
    ipv6,
    bridgedSubrange,
    onSuccess: (newUpdateTaskId) => {
      trackTask({
        taskId: newUpdateTaskId,
        resourceId: bridgedSubrange,
        onFinished: () => {
          void queryClient.invalidateQueries({
            queryKey: getVrackIpv6BridgedSubrangeDetailKey(serviceName, ipv6, bridgedSubrange),
          });
          setIsUpdatingSlaac(false);
        },
      });
    },
    onError: (error) => {
      clearNotifications();
      addError(
        <Text>{t('publicIpRouting_region_detach_ip_error', { apiError: error.message })}</Text>,
      );
    },
  });

  return (
    <Toggle
      checked={value === 'enabled'}
      className="flex items-center"
      onCheckedChange={({ checked }) => {
        const updatedSlackValue = checked ? 'enabled' : 'disabled';
        setIsUpdatingSlaac(true);
        updateBridgedSubrange({ slaac: updatedSlackValue });
      }}
    >
      <ToggleLabel>{t('publicIpRouting_region_attached_ip_slaac_label')}</ToggleLabel>
      {isUpdatingSlaac ? <Skeleton className="w-12" /> : <ToggleControl className="w-12" />}
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon name="circle-question" />
        </TooltipTrigger>
        <TooltipContent className="max-w-64">
          <Text className="mb-4">{t('publicIpRouting_region_attached_ip_slaac_tooltip')}</Text>
          <Link href={slaacLink} target="_blank">
            <Icon name="book" />
            {t('publicIpRouting_region_attached_ip_slaac_tooltip_link')}
          </Link>
        </TooltipContent>
      </Tooltip>
    </Toggle>
  );
};
