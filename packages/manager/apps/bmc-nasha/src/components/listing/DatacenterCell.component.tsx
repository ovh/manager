type DatacenterCellProps = {
  datacenter: string;
};

export default function DatacenterCell({ datacenter }: DatacenterCellProps) {
  return <>{datacenter}</>;
}
