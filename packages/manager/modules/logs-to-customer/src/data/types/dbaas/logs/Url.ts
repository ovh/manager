import { UrlTypeEnum } from '@/data/types/dbaas/logs/UrlTypeEnum';

/** Web address */
export interface Url {
  /** Web URI */
  address: string;
  /** Service type */
  type: UrlTypeEnum;
}
