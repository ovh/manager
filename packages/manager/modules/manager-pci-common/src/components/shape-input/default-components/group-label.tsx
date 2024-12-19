export const DefaultGroupLabelComponent = ({
  groupName,
  isGroupSelected,
  groupItems,
  isMobile,
}: {
  groupName: string;
  isGroupSelected: boolean;
  groupItems: unknown[];
  isMobile: boolean;
}): JSX.Element => (
  <div className="whitespace-nowrap p-4 font-bold">
    {groupName}({groupItems?.length || 0}) [
    {isGroupSelected ? 'selected' : 'not selected'}] /
    {isMobile ? ' mobile' : 'not mobile'}/
  </div>
);
