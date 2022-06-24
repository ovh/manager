import React from 'react';
import OvhCloudPreloader from './OvhCloudPreloader';

import styles from './styles.module.scss';

type Props = {
  visible: boolean;
  children: JSX.Element;
};

const Preloader = ({ visible = false, children }: Props): JSX.Element => {
  return (
    <div className={`${styles.preloaderContainer}`}>
      <OvhCloudPreloader visible={visible}></OvhCloudPreloader>
      {children}
    </div>
  );
};

export default Preloader;
