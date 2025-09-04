import { sortTags } from './sortTags';
import tagsList from '../../../../../mocks/iam-tags/getIamTags.json';
import { IamTagListItem } from '@/data/api/get-iam-tags';

describe('sortTags util', () => {
  it('sort tag list by count desc', () => {
    expect(
      sortTags({
        tags: tagsList.list as IamTagListItem[],
        columnId: 'count',
        desc: true,
      })[0].name,
    ).toBe('test:coucou');
  });

  it('sort tag list by count asc', () => {
    expect(
      sortTags({
        tags: tagsList.list as IamTagListItem[],
        columnId: 'count',
        desc: false,
      })[0].count,
    ).toBe(1);
  });

  it('sort tag list by name asc', () => {
    expect(
      sortTags({
        tags: tagsList.list as IamTagListItem[],
        columnId: 'name',
        desc: false,
      })[0].name,
    ).toBe('afirst:tag');
  });

  it('sort tag list by name desc', () => {
    expect(
      sortTags({
        tags: tagsList.list as IamTagListItem[],
        columnId: 'name',
        desc: true,
      })[0].name,
    ).toBe('test:coucou');
  });
});
