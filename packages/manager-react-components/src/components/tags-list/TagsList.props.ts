import { TagsObj } from './TagsList.type';

export type TagsListProps = {
  tags: TagsObj;
  displayInternalTags?: boolean;
  maxLines?: number;
  onClick?: () => void;
};
