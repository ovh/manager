import { sanitizeLabel } from './tracking';

describe('sanitizeLabel', () => {
  it('remove spaces and :', () => {
    expect(sanitizeLabel('example label : test :: test')).toBe(
      'example_label__test__test',
    );
  });
});
