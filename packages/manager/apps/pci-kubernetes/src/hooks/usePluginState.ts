import { useCallback } from 'react';

const usePluginState = (enabled: string[], disabled: string[]) =>
  useCallback(
    (pluginName: string) => {
      if (enabled.includes(pluginName)) {
        return 'enabled';
      }
      if (disabled.includes(pluginName)) {
        return 'disabled';
      }
      return null;
    },
    [enabled, disabled],
  );

export default usePluginState;
