import { IamObject } from '../hooks';

export type Tag = {
  key: string;
  values: string[];
};

export const formatIamTagsFromResources = (resources: IamObject[]): Tag[] => {
  return resources.reduce((tags, resource) => {
    if (!resource.tags) return tags;

    const updatedTags = tags;

    Object.keys(resource.tags).forEach((key) => {
      if (key.startsWith('ovh:')) return;
      const alreadyExistingKeyIndex = updatedTags.findIndex(
        (tag) => tag.key === key,
      );
      if (alreadyExistingKeyIndex !== -1) {
        updatedTags[alreadyExistingKeyIndex].values = [
          ...new Set([
            ...updatedTags[alreadyExistingKeyIndex].values,
            resource.tags[key],
          ]),
        ];
      } else {
        updatedTags.push({
          key,
          values: [resource.tags[key]],
        });
      }
    });
    return updatedTags;
  }, [] as Tag[]);
};
