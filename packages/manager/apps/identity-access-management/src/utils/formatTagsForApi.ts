/**
 * Format tag list to use it in update resource api call
 * @param tags
 * @returns
 */
export const formatTagsForApi = (tags: string[]) => {
  return tags.reduce((formatted, tag) => {
    const [key, ...value] = tag.split(':');
    return {
      ...formatted,
      [key]: value.join(':'),
    };
  }, {});
};
