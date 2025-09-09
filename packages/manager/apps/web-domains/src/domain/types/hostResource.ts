export interface THost {
  hosts_configurations: {
    hostSupported: boolean;
    host: string | null;
    ips: string[] | null;
  }[];
}
