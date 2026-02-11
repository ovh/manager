import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Table } from '@ovhcloud/ods-react';

import { Ipv6BridgedSubrangeDetails } from '@/data/api/get/bridgedSubrange';
import { Ipv6RoutedSubrangeDetails } from '@/data/api/get/routedSubrange';
import { Ipv6Detail } from '@/data/api/get/vrackIp';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { IpTableBlock } from './ip-table-block/IpTableBlock';

interface IpTableProps {
  serviceName: string;
  ipv4List: string[];
  ipv6List: Ipv6Detail[];
}

type IpType = 'ipV4' | 'ipV6';

type IpBlock = {
  ip: string;
  ipType: IpType;
  bridgedSubranges?: Ipv6BridgedSubrangeDetails[];
  routedSubranges?: Ipv6RoutedSubrangeDetails[];
  opened: boolean;
};

export const IpTable = ({ serviceName, ipv4List, ipv6List }: IpTableProps) => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const [openedBlocks, setOpenedBlocks] = useState<string[]>([]);

  const ipv4Blocks: IpBlock[] = useMemo(
    () =>
      ipv4List.map((ip) => ({
        ip,
        ipType: 'ipV4' as IpType,
        opened: false,
      })),
    [ipv4List],
  );

  const ipv6Blocks: IpBlock[] = useMemo(
    () =>
      ipv6List.map(({ ipv6, bridgedSubranges, routedSubranges }) => ({
        ip: ipv6,
        ipType: 'ipV6' as IpType,
        bridgedSubranges: bridgedSubranges ?? [],
        routedSubranges: routedSubranges ?? [],
        opened: openedBlocks.includes(ipv6),
      })),
    [ipv6List, openedBlocks],
  );

  const toggleDisplayIpBlock = useCallback(
    (ip: string) => {
      const updatedBlocks = [...openedBlocks];
      const matchingIdx = openedBlocks.findIndex((openedIp) => openedIp === ip);
      if (matchingIdx !== -1) {
        updatedBlocks.splice(matchingIdx, 1);
      } else {
        updatedBlocks.push(ip);
      }
      setOpenedBlocks(updatedBlocks);
    },
    [openedBlocks],
  );

  return (
    <Table>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col" className="text-left" colSpan={2}>
            {t('publicIpRouting_region_attached_ip_addresses')}
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {ipv4Blocks.map((ipBlock, idx) => (
          <IpTableBlock
            {...ipBlock}
            serviceName={serviceName}
            rowIdx={idx}
            onIpBlockToggled={toggleDisplayIpBlock}
            key={ipBlock.ip}
          />
        ))}
        {ipv6Blocks.map((ipBlock, idx) => (
          <IpTableBlock
            {...ipBlock}
            serviceName={serviceName}
            rowIdx={idx}
            onIpBlockToggled={toggleDisplayIpBlock}
            key={ipBlock.ip}
          />
        ))}
      </tbody>
    </Table>
  );
};
