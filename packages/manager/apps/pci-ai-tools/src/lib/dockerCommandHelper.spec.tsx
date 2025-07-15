import { describe, vi } from 'vitest';
import { parseDockerCommand } from './dockerCommandHelper';

describe('dockerCommandHelper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('parse command into string table ', () => {
    const cmd = 'docker test "command unit tests"';
    const tableCmd = parseDockerCommand(cmd);
    expect(tableCmd).toStrictEqual(['docker', 'test', 'command unit tests']);
  });
});
