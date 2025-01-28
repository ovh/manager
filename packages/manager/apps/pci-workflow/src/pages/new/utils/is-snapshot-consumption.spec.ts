import { isSnapshotConsumption } from './is-snapshot-consumption';

describe('isSnapshotConsumption', () => {
  it('should return true for snapshot consumption codes', () => {
    const result = isSnapshotConsumption('snapshot.consumption.example');
    expect(result).toBe(true);
  });

  it('should return false for non-snapshot consumption codes', () => {
    const result = isSnapshotConsumption('some.other.code');
    expect(result).toBe(false);
  });

  it('should return false for empty string', () => {
    const result = isSnapshotConsumption('');
    expect(result).toBe(false);
  });

  it('should return false for null input', () => {
    const result = isSnapshotConsumption(null);
    expect(result).toBe(false);
  });

  it('should return false for undefined input', () => {
    const result = isSnapshotConsumption(undefined);
    expect(result).toBe(false);
  });
});
