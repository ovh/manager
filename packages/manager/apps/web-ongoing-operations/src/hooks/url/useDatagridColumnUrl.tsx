import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useGetDomainInformation } from '@/hooks/data/query';
import { ParentEnum } from '@/enum/parent.enum';

export function useDatagridColumnUrl({
  parent,
  props,
}: OngoingOperationDatagridDomainProps) {
  let value: string = props.domain || props.zone;
  const { data: managerUrl } = useNavigationGetUrl(['web', '', {}]);
  const { data: allDom } = useNavigationGetUrl(['web-domains', '', {}]);
  let url = `${managerUrl}/${ParentEnum.DOMAIN}/${value}/information`;

  if (parent === ParentEnum.ZONE) {
    const { data: serviceInfo } = useGetDomainInformation(props.zone);
    if (!serviceInfo) {
      url = `${managerUrl}/${parent}/${value}`;
    }
  }

  if (parent === ParentEnum.ALLDOM) {
    value = props.domain;
    url = `${allDom}/alldom/${value}`;
  }

  return { url, value };
}
