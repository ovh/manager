import React from 'react';
import { OdsSwitch, OdsSwitchItem } from '@ovhcloud/ods-components/react';
import { NavLink } from 'react-router-dom';
import { FeatureSwitcherItem } from '../../types';

export interface ObsFeatureSwitcherProps {
  items: FeatureSwitcherItem[];
  activeItemId: string;
}

export const ObsFeatureSwitcher = ({
  items,
  activeItemId,
}: Readonly<ObsFeatureSwitcherProps>): JSX.Element => {
  return (
    <div className="h-10 flex justify-center items-center">
      <OdsSwitch className="h-10" name="switchState">
        {items.map(({ id, link, onClick }) => (
          <NavLink
            key={`obs-feature-${id}`}
            to={link || ''}
            {...(onClick ? { onClick } : {})}
            className="no-underline"
          >
            <OdsSwitchItem
              class="w-24 h-10"
              isChecked={id === activeItemId}
              value={id}
            >
              <span className="px-2">{id}</span>
            </OdsSwitchItem>
          </NavLink>
        ))}
      </OdsSwitch>
    </div>
  );
};
