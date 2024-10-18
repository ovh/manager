import { renderHook } from '@testing-library/react';
import usePluginState from './usePluginState';

describe('usePluginState', () => {
  it('should return "enabled" if the plugin is in the enabled list', () => {
    const enabled = ['plugin1', 'plugin2'];
    const disabled = ['plugin3'];
    const { result } = renderHook(() => usePluginState(enabled, disabled));

    expect(result.current('plugin1')).toBe('enabled');
    expect(result.current('plugin2')).toBe('enabled');
  });

  it('should return "disabled" if the plugin is in the disabled list', () => {
    const enabled = ['plugin1', 'plugin2'];
    const disabled = ['plugin3'];
    const { result } = renderHook(() => usePluginState(enabled, disabled));

    expect(result.current('plugin3')).toBe('disabled');
  });

  it('should return null if the plugin is not in either list', () => {
    const enabled = ['plugin1', 'plugin2'];
    const disabled = ['plugin3'];
    const { result } = renderHook(() => usePluginState(enabled, disabled));

    expect(result.current('plugin4')).toBeNull();
  });
});
