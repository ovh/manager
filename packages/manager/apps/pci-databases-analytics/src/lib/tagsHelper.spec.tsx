import { describe, vi } from 'vitest';
import { getTagVariant, updateTags } from '@/lib/tagsHelper';
import * as database from '@/types/cloud/project/database';
import { mockedFlavor } from '../__tests__/helpers/mocks/availabilities';

describe('tagsHelper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('getTagVariant should be success', () => {
    const mockedTags: database.capabilities.TagEnum =
      database.capabilities.TagEnum.current;
    const tagVariant = getTagVariant(mockedTags);
    expect(tagVariant).toBe('success');
  });
  it('getTagVariant should be warning', () => {
    const mockedTags: database.capabilities.TagEnum =
      database.capabilities.TagEnum.soonDeprecated;
    const tagVariant = getTagVariant(mockedTags);
    expect(tagVariant).toBe('warning');
  });

  it('getTagVariant should be info', () => {
    const tagVariant = getTagVariant('test' as database.capabilities.TagEnum);
    expect(tagVariant).toBe('info');
  });

  it('updateTags should return same flavor', () => {
    const updateFlavorTags = updateTags([mockedFlavor], 'flavorName');
    expect(updateFlavorTags).toStrictEqual([mockedFlavor]);
  });

  it('updateTags should return flavor with current tag', () => {
    const newFlavor: database.capabilities.Flavor = {
      ...mockedFlavor,
      tags: [],
    };
    const updateFlavorTags = updateTags([newFlavor], 'flavor');
    expect(updateFlavorTags).toStrictEqual([mockedFlavor]);
  });
});
