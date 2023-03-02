export function debug(...args: any[]) {
  if (!window.test && //temporarily  fix jest bug
    window.localStorage?.getItem('MANAGER_TRACKING_DEBUG')) {
    console.debug(...args);
  }
}
