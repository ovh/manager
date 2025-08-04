import { ResourcesDatagridFilter } from '@/components/resourcesDatagridTopbar/ResourcesDatagridTopbar.component';

/**
 * Create queryParams to request api with fiters
 * @param filters
 * @returns string already formatted to use as query params
 */
export const formatFiltersForApi = (filters: ResourcesDatagridFilter[]) => {
  const params = new URLSearchParams();

  const tagsFilter = filters.reduce((tagQueryObject, filter) => {
    if (!filter?.tagKey) {
      params.append(filter.column, filter.value);
      return tagQueryObject;
    }

    const newTagQueryObject = tagQueryObject;

    if (!newTagQueryObject[filter.tagKey]) {
      newTagQueryObject[filter.tagKey] = [
        {
          operator: 'EQ',
          value: filter.value,
        },
      ];
    } else {
      newTagQueryObject[filter.tagKey].push({
        operator: 'EQ',
        value: filter.value,
      });
    }

    return newTagQueryObject;
  }, {} as Record<string, Array<{ operator: string; value: string }>>);

  if (Object.keys(tagsFilter).length !== 0) {
    params.append('tags', JSON.stringify(tagsFilter));
  }

  return params.toString();
};

/**
 * Format unique tag to Filter type
 * @param tag
 * @returns
 */
export const tagTofilter = (
  tag: string,
  hidden?: boolean,
): ResourcesDatagridFilter => {
  const [key, ...value] = tag.split(':');

  return {
    column: 'tags',
    id: `tags:${key}:${value.join(':')}`,
    tagKey: key,
    value: value.join(':'),
    hidden,
  };
};
