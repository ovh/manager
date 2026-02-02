import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Table } from '@ovhcloud/ods-react';

import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { IpTableBlock } from './ip-table-block/IpTableBlock';

interface IpTableProps {
  ipv4List: string[];
  ipv6List: string[];
}

type IpBlock = {
  ip: string;
  bridgedSubrange: string[];
  opened: boolean;
};

export const IpTable = ({ ipv4List, ipv6List }: IpTableProps) => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const [ipBlocks, setIpBlocks] = useState<IpBlock[]>([
    ...ipv4List.map((ip) => ({ ip, bridgedSubrange: [], opened: false })),
    ...ipv6List.map((ip) => ({ ip, bridgedSubrange: [], opened: false })),
  ]);

  const toggleDisplayIpBlock = useCallback(
    (ip: string) => {
      const updatedIpBlocks = ipBlocks.map((block) =>
        ip === block.ip ? { ...block, opened: !block.opened } : block,
      );
      setIpBlocks(updatedIpBlocks);
    },
    [ipBlocks],
  );

  return (
    <Table>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col" className="text-left">
            {t('publicIpRouting_region_attached_ip_addresses')}
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {ipBlocks.map((ipBlock, idx) => (
          <IpTableBlock
            {...ipBlock}
            rowIdx={idx}
            onIpBlockToggled={toggleDisplayIpBlock}
            key={ipBlock.ip}
          />
        ))}
      </tbody>
    </Table>
  );
};
