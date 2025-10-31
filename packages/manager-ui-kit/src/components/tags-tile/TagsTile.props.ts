import { TagsListProps } from '../tags-list/TagsList.props';

export interface TagsTileProps extends Omit<TagsListProps, 'onClick'> {
  onEditTags?: () => void;
  lineNumber?: number;
}
