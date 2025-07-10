export const formatTagsForApi = (tags: string[]) => {
  return tags.reduce((formatted, tag) => {
    const [key, ...value] = tag.split(':');
    return {
      ...formatted,
      [key]: value.join(':'),
    };
  }, {});
};
