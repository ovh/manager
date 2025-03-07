import React from 'react';
import { VmacWithIpType } from '@/data/hooks/ip';

export type IpVmacFilterByIpProps = {
  ip: string;
  vmacsWithIp: VmacWithIpType[];
  enabled?: boolean;
};

/**
 * Component to display the cell content for IP Vmac
 * No data fetching is done here, just select vmac corresponding to given ip
 * Display rules:
 * If not enabled display nothing
 * If enabled but has no vmac display "-"
 * If enabled and has a vmac for given ip, display the mac address
 * @param ip the ip to check if vmac exist for it
 * @param vmacsWithIp list of all vmacs populate with ips
 * @param enabled to show or not the information
 * @returns React Component
 */
export const IpVmacFilterByIp = ({
  ip,
  vmacsWithIp,
  enabled = true,
}: IpVmacFilterByIpProps) => {
  const vmac = vmacsWithIp.find((vmacs) =>
    vmacs?.ip?.some((vmacIp) => ip === vmacIp),
  );

  return (
    <>
      {!enabled && null}
      {enabled && !vmac && <>-</>}
      {enabled && !!vmac && <div>{vmac.macAddress}</div>}
    </>
  );
};
