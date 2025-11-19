import { StatusEnum } from '@/domain/enum/Status.enum';

export interface THostsconfiguration {
  hostSupported?: boolean;
  ipv4Supported?: boolean;
  ipv6Supported?: boolean;
  multipleIPsSupported?: boolean;
  hosts?: THost[];
}

export interface THost {
  host: string | null;
  status: StatusEnum;
  ips: string[] | null;
}
