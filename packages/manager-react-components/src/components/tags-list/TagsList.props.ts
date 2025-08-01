export type TagsListProps = {
  tags: { [key: string]: string };
  displayInternalTags?: boolean;
  maxLines?: number;
  modalHeading: string;
  onEditTags?: () => void;
};
