export type IamObject = {
  tags?: Record<string, string>;
};

export type Tag = {
  key: string;
  values: string[];
};

export const formatIamTagsFromResources = (resources: IamObject[]): Tag[] => {
  const tagsMap = new Map<string, Set<string>>();

  resources.forEach((resource) => {
    if (!resource.tags) return;

    Object.entries(resource.tags).forEach(([key, value]) => {
      if (key.startsWith('ovh:')) return;

      if (!tagsMap.has(key)) {
        tagsMap.set(key, new Set([value]));
      } else {
        tagsMap.get(key)?.add(value);
      }
    });
  });

  return Array.from(tagsMap.entries()).map(([key, values]) => ({
    key,
    values: Array.from(values),
  }));
};
