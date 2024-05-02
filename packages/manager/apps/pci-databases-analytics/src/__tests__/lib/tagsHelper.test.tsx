import { describe, vi } from 'vitest';
import { getTagVariant, updateTags } from '@/lib/tagsHelper';
import { database } from '@/models/database';
import { mockedFlavor } from '../helpers/mocks/availabilities';

describe('tagsHelper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('getTagVariant should be success', () => {
    const mockedTags: database.capabilities.Tags =
      database.capabilities.Tags.current;
    const tagVariant = getTagVariant(mockedTags);
    expect(tagVariant).toBe('success');
  });
  it('getTagVariant should be warning', () => {
    const mockedTags: database.capabilities.Tags =
      database.capabilities.Tags.soonDeprecated;
    const tagVariant = getTagVariant(mockedTags);
    expect(tagVariant).toBe('warning');
  });

  it('getTagVariant should be info', () => {
    const tagVariant = getTagVariant('test' as database.capabilities.Tags);
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
