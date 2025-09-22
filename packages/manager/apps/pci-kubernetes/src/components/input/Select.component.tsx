import { ReactNode, useEffect, useRef } from 'react';

import { JSX as OdsJSX } from '@ovhcloud/ods-components';
import { OsdsSelect } from '@ovhcloud/ods-components/react';

type TSelectProps = OdsJSX.OsdsSelect & { children: ReactNode };

export const SelectComponent = (props: TSelectProps) => {
  const ref = useRef(null);

  /**
   * Workaround to solve ods select width on mobile
   * TODO: solve on ods side
   */
  useEffect(() => {
    if (ref.current && !ref.current.shadowRoot.querySelector('style')) {
      const style = document.createElement('style');
      style.innerHTML = '.ocdk-surface--open {max-width: 100%;}';
      ref.current.shadowRoot.appendChild(style);
    }
  }, [ref.current]);

  return <OsdsSelect ref={ref} {...props} />;
};
