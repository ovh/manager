import { TagMap } from '../types/Tag';

export const transformTagsToApi = (tags?: TagMap): Record<string, string> => {
  if (!tags) return {};

  return Object.values(tags).reduce((acc, { key, value }) => {
    if (key !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
};

export const transformTagsFromApi = (tags?: Record<string, string>): TagMap => {
  if (!tags) return {};

  return Object.entries(tags).reduce((acc, [key, value], index) => {
    acc[index + 1] = { key, value };
    return acc;
  }, {} as TagMap);
};
