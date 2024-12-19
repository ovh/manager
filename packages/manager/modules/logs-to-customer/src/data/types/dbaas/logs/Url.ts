import { UrlTypeEnum } from './UrlTypeEnum';

/** Web address */
export interface Url {
  /** Web URI */
  address: string;
  /** Service type */
  type: UrlTypeEnum;
}
