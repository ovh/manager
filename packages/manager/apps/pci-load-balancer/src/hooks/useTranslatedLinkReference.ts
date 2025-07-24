import { useEffect, useRef } from 'react';
import {
  TrackingClickParams,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

export const useTranslatedLinkReference = () => {
  const { trackClick } = useOvhTracking();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      const anchors = ref.current.querySelectorAll<HTMLAnchorElement>(
        'a,osds-link',
      );
      anchors.forEach((anchor) => {
        const { trackName, trackOn, trackType, handled } = anchor.dataset;
        if (!handled) {
          anchor.classList.add(
            'font-bold',
            'no-underline',
            'text-blue-600',
            'hover:underline',
          );

          anchor.setAttribute('data-handled', 'true');
          if (trackOn === 'click') {
            anchor.addEventListener('click', () => {
              trackClick({
                actions: [trackName],
                actionType:
                  (trackType as TrackingClickParams['actionType']) || 'action',
              });
            });
          }
        }
      });
    }
  }, [ref.current]);

  return ref;
};
