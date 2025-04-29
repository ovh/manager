import { IamObject } from '../hooks';

export type Tag = {
  key: string;
  values: string[];
};

export const formatIamTagsFromResources = (resources: IamObject[]): Tag[] => {
  const allTags = [];
  resources
    .filter(({ tags }) => tags != undefined)
    .forEach((resource) => {
      Object.keys(resource.tags).forEach((key) => {
        if (key.startsWith('ovh:')) return;
        const alreadyExistingKeyIndex = allTags.findIndex(
          (tag) => tag.key === key,
        );
        if (alreadyExistingKeyIndex !== -1) {
          allTags[alreadyExistingKeyIndex].values = [
            ...new Set([
              ...allTags[alreadyExistingKeyIndex].values,
              resource.tags[key],
            ]),
          ];
        } else {
          allTags.push({
            key,
            values: [resource.tags[key]],
          });
        }
      });
    });
  return allTags;
};
