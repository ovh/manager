// @TODO implements tracking plugin

export function exposeTrackingAPI(): unknown {
  return {
    init: () => {},
    clearTrackQueue: () => {},
    processTrackQueue: () => {},
    trackClick: () => {},
    trackPage: () => {},
    trackOrder: () => {},
    trackEvent: () => {},
    trackImpression: () => {},
    trackClickImpression: () => {},
    isEnabled: () => {},
    setEnabled: () => {},
    setDebug: () => {},
    setRegion: () => {},
    getRegion: () => {},
  };
}

export default exposeTrackingAPI;
