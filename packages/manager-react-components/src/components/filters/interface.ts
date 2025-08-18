import { Filter } from '@ovh-ux/manager-core-api';

export type FilterWithLabel = Filter & { label: string };

export type TagsFilterFormProps = {
  setTagKey: (tagKey: string) => void;
};
