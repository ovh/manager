import { useContext, useEffect, useRef } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useTranslatedLinkReference = () => {
  const { tracking } = useContext(ShellContext).shell;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      const anchors = ref.current.querySelectorAll<HTMLAnchorElement>('a');
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
              tracking.trackClick({
                name: trackName,
                type: trackType || 'action',
              });
            });
          }
        }
      });
    }
  }, [ref.current]);

  return ref;
};
