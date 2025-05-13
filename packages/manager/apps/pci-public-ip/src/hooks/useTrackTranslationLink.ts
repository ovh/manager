import { MutableRefObject, useEffect } from 'react';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { PCI_LEVEL2 } from '@/tracking.constants';

/**
 * this hook can be used to automatically trigger tracking defined in translations
 * @param ref : {MutableRefObject<HTMLElement>} reference to a dom element containing translations with tracking
 */
export const useTrackTranslationLink = (ref: MutableRefObject<HTMLElement>) => {
  const { trackClick } = useTracking();

  useEffect(() => {
    if (ref.current) {
      const trackables: NodeListOf<HTMLElement> = ref.current.querySelectorAll(
        '[data-track-name]',
      );
      trackables.forEach((trackable) => {
        const { dataset } = trackable;
        const { trackName, trackType, trackOn, hasTrackCallback } = dataset;
        if (!hasTrackCallback) {
          if (trackOn === 'click') {
            trackable.addEventListener('click', () => {
              trackClick({
                name: trackName,
                type: trackType,
                level2: PCI_LEVEL2,
              });
            });
          }
          dataset.hasTrackCallback = 'true';
        }
      });
    }
  }, [ref]);
};
