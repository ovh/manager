import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useGetDomainInformation } from '@/hooks/data/query';
import { ParentEnum } from '@/enum/parent.enum';

export function useDatagridColumnUrl({
  parent,
  props,
}: OngoingOperationDatagridDomainProps) {
  const value: string = props[parent];
  const { data: managerUrl } = useNavigationGetUrl(['web', '', {}]);
  let url = `${managerUrl}/${ParentEnum.DOMAIN}/${value}/information`;

  if (parent === ParentEnum.ZONE) {
    const { data: serviceInfo } = useGetDomainInformation(props.zone);
    if (!serviceInfo) {
      url = `${managerUrl}/${parent}/${value}`;
    }
  }

  return { url, value };
}
