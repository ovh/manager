import { isSnapshotConsumption } from './is-snapshot-consumption';

describe('isSnapshotConsumption', () => {
  it.each([
    [
      'should return true for snapshot consumption codes',
      'snapshot.consumption.example',
      true,
    ],
    [
      'should return false for non-snapshot consumption codes',
      'some.other.code',
      false,
    ],
    ['should return false for empty string', '', false],
  ])('%s', (_, input, expected) => {
    expect(isSnapshotConsumption(input)).toBe(expected);
  });
});
