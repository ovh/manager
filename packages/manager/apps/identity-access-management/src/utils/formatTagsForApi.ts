export const formatTagsForApi = (tags: string[]) => {
  return tags.reduce((formatted, tag) => {
    const [key, ...value] = tag.split(':');
    return {
      ...formatted,
      [key]: value.join(':'),
    };
  }, {});
};

export const formatTagsForApiFilterParam = (tags: string[]) => {
  const queryParams = tags.reduce((formatted, tag) => {
    const [key, ...value] = tag.split(':');
    return {
      ...formatted,
      [key]: [
        {
          operator: 'EQ',
          value: value.join(':'),
        },
      ],
    };
  }, {});
  return `?tags=${encodeURIComponent(JSON.stringify(queryParams))}`;
};
