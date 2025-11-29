type CustomNameCellProps = {
  customName?: string;
};

export default function CustomNameCell({ customName }: CustomNameCellProps) {
  return <>{customName || '-'}</>;
}
