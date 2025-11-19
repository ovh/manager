import { TagsList } from '@ovh-ux/manager-react-components';

interface DatagridColumnTagsProps {
  readonly tags: Record<string, string> | null;
}

export default function DatagridColumnTags({ tags }: DatagridColumnTagsProps) {
  return <>{tags && <TagsList tags={tags} />}</>;
}
