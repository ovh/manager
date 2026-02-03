import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useGetDomainInformation } from '@/hooks/data/query';
import { ParentEnum } from '@/enum/parent.enum';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export function useDatagridColumnUrl({
  parent,
  props,
}: OngoingOperationDatagridDomainProps) {
  let value: string = props.domain || props.zone || '';
  const { data: availability } = useFeatureAvailability(['web-domains:domains']);
  const { data: managerUrl } = useNavigationGetUrl(['web', '', {}]);
  const { data: webDomainsUrl } = useNavigationGetUrl(['web-domains', '', {}]);
  const { data: serviceInfo } = useGetDomainInformation(value);

  let url = `${managerUrl}/${ParentEnum.DOMAIN}/${value}/information`;
  if (parent === ParentEnum.ZONE) {
    if (!serviceInfo) {
      url = `${managerUrl}/${parent}/${value}`;
    }
  }

  if (availability?.['web-domains:domains']){
    url = `${webDomainsUrl}/${ParentEnum.DOMAIN}/${value}/information`;
    if (parent === ParentEnum.ZONE) {
      if (!serviceInfo) {
        url = `${webDomainsUrl}/${value}/${parent}`;
      }
    }
  }

  if (parent === ParentEnum.ALLDOM) {
    url = `${webDomainsUrl}/alldoms/${value}`;
  }

  return { url, value };
}
