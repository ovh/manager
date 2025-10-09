import { TagsListProps } from '../tags-list';

export interface TagsTileProps extends Omit<TagsListProps, 'onClick'> {
  onEditTags?: () => void;
  lineNumber?: number;
}
