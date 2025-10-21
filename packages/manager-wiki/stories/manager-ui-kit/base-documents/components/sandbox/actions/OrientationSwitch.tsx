import { Icon, ICON_NAME, Switch, SwitchItem } from '@ovhcloud/ods-react';
import React, { type JSX } from 'react';
import styles from './orientationSwitch.module.css';

enum ORIENTATION {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

interface Prop {
  onChange: (orientation: ORIENTATION) => void,
  orientation: ORIENTATION
}

const OrientationSwitch = ({ onChange, orientation }: Prop): JSX.Element => {
  return (
    <Switch
      onValueChange={ ({ value }) => onChange(value as ORIENTATION) }
      value={ orientation }>
      <SwitchItem
        className={ styles['orientation-switch__horizontal'] }
        value={ ORIENTATION.horizontal }>
        <Icon name={ ICON_NAME.columns } />
      </SwitchItem>

      <SwitchItem
        className={ styles['orientation-switch__vertical'] }
        value={ ORIENTATION.vertical }>
        <Icon
          className={ styles['orientation-switch__vertical__icon'] }
          name={ ICON_NAME.columns } />
      </SwitchItem>
    </Switch>
  );
};

export {
  ORIENTATION,
  OrientationSwitch,
};
