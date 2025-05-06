import { TServiceDetail } from '@/alldoms/types';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';

export const findContact = (
  props: TServiceDetail,
  contactType: ServiceInfoContactEnum,
) => {
  const filter = props.serviceInfo.customer.contacts.find(
    (c) => c.type === contactType,
  );
  return filter.customerCode;
};
