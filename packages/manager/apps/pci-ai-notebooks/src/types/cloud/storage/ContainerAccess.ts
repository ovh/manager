import { Endpoint } from '@/types/cloud/storage/Endpoint';

/** ContainerAccess */
export interface ContainerAccess {
  /** Storage access endpoints */
  endpoints?: Endpoint[];
  /** Storage access token */
  token?: string;
}
