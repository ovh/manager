import { OsdsSelect } from '@ovhcloud/ods-components/react';
import { HTMLAttributes, RefAttributes, useEffect, useRef } from 'react';
import { JSX as OdsJSX } from '@ovhcloud/ods-components';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';

type TSelectProps = OdsJSX.OsdsSelect &
  Omit<HTMLAttributes<HTMLOsdsSelectElement>, 'style'> &
  StyleReactProps &
  RefAttributes<HTMLOsdsSelectElement>;

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
