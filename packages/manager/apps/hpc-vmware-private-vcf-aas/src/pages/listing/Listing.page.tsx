import { Text } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn } from '@ovh-ux/muk';

type WorkloadDomain = {
  id: string;
  name: string;
  description: string;
  location: string;
};

const columns: DatagridColumn<WorkloadDomain>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => <Text>{row.original.name}</Text>,
  },
  {
    id: 'description',
    header: 'Description',
    cell: ({ row }) => <Text>{row.original.description}</Text>,
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => <Text>{row.original.location}</Text>,
  },
];

const data: WorkloadDomain[] = [
  {
    id: 'wld-eu-west-eri',
    name: 'wld-eu-west-eri',
    description: 'OVHcloud Workload Domain EU-WEST-ERI',
    location: 'eu-west-eri',
  },
  {
    id: 'wld-eu-west-rbx',
    name: 'wld-eu-west-rbx',
    description: 'OVHcloud Workload Domain EU-WEST-RBX',
    location: 'eu-west-rbx',
  },
  {
    id: 'wld-eu-west-sbg',
    name: 'wld-eu-west-sbg',
    description: 'OVHcloud Workload Domain EU-WEST-SBG',
    location: 'eu-west-sbg',
  },
];

export default function Listing() {
  return (
    <section className="flex flex-col gap-8 p-5">
      <Text preset="heading-1" className="mb-5">
        Workload Domains
      </Text>
      <Datagrid columns={columns} data={data} />
    </section>
  );
}
