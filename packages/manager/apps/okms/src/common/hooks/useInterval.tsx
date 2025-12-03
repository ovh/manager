import { useEffect, useState } from 'react';

/**
 * Hook to trigger a function at a given interval
 *
 * - Interval can be stopped by setting the delayInMs to 0 or by calling the stopInterval function
 * - The callback function can receive an AbortSignal to cancel the potential pending requests
 * - Requests are automatically aborted when the component unmounts or when interval is stopped
 * @param callback - The function to call on each interval
 * @param delayInMs - The delay between each call. If 0, the interval will be stopped.
 * @returns - A function to stop the interval
 */

export type IntervalCallback = (signal?: AbortSignal) => Promise<void>;

export const useInterval = (callback: IntervalCallback, delayInMs: number) => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!enabled || !delayInMs) {
      return undefined;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const intervalId = setInterval(() => callback(signal), delayInMs);

    // Cleanup on unmount or when any dependency changes
    return () => {
      clearInterval(intervalId);
      controller.abort();
    };
  }, [callback, delayInMs, enabled]);

  return {
    stopInterval: () => setEnabled(false),
  };
};
