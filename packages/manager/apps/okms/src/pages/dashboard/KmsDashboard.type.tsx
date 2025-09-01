import { ServiceDetails } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';

export type KmsDashboardOutletContext = {
  okms: OKMS;
  okmsDisplayName: string;
  okmsService: ServiceDetails | undefined;
};
