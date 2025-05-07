import { IamObject } from '../hooks';

export type Tag = {
  key: string;
  values: string[];
};

export const formatIamTagsFromResources = (resources: IamObject[]): Tag[] => {
  return resources.reduce((tags, resource) => {
    if (!resource.tags) return tags;

    Object.keys(resource.tags).forEach((key) => {
      if (key.startsWith('ovh:')) return;
      const alreadyExistingKeyIndex = tags.findIndex((tag) => tag.key === key);
      if (alreadyExistingKeyIndex !== -1) {
        tags[alreadyExistingKeyIndex].values = [
          ...new Set([
            ...tags[alreadyExistingKeyIndex].values,
            resource.tags[key],
          ]),
        ];
      } else {
        tags.push({
          key,
          values: [resource.tags[key]],
        });
      }
    });
    return tags;
  }, [] as Tag[]);
};
