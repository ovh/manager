import { describe, expect, it, vi } from 'vitest';

import {
  getLinuxCurlCommand,
  getLinuxWgetCommand,
  getWindowsCommand,
  getWindowsFilename,
  triggerDownload,
} from './agentCommands';

describe('agentCommands', () => {
  // TC-TNL-83
  it('builds the Linux curl + wget commands from the download URL', () => {
    const url = 'https://download.ovh.net/agent/linux/agent.sh';
    expect(getLinuxCurlCommand(url)).toBe(
      'curl -O "https://download.ovh.net/agent/linux/agent.sh"',
    );
    expect(getLinuxWgetCommand(url)).toBe('wget "https://download.ovh.net/agent/linux/agent.sh"');
  });

  // TC-TNL-84
  it('builds the Windows PowerShell command with the extracted filename', () => {
    const url = 'https://download.ovh.net/agent/windows/agent-1.2.3.exe';
    expect(getWindowsCommand(url)).toBe(
      'Invoke-WebRequest -Uri "https://download.ovh.net/agent/windows/agent-1.2.3.exe" -OutFile "agent-1.2.3.exe"',
    );
  });

  it('extracts the filename from a valid URL', () => {
    expect(getWindowsFilename('https://host/path/to/setup.exe')).toBe('setup.exe');
  });

  // TC-TNL-89
  it('falls back to agent.exe when the URL has no parseable filename', () => {
    expect(getWindowsFilename('not a url')).toBe('agent.exe');
    expect(getWindowsFilename('https://host/')).toBe('agent.exe');
  });

  // TC-TNL-79
  it('triggers a download via a transient anchor that is clicked then removed', () => {
    const clickSpy = vi.fn();
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'remove');
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(clickSpy);

    triggerDownload('https://host/agent.sh');

    expect(appendSpy).toHaveBeenCalledTimes(1);
    const anchor = appendSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
    expect(anchor.tagName).toBe('A');
    expect(anchor.href).toContain('https://host/agent.sh');
    expect(anchor.getAttribute('download')).toBe('');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);

    appendSpy.mockRestore();
    removeSpy.mockRestore();
    vi.restoreAllMocks();
  });
});
