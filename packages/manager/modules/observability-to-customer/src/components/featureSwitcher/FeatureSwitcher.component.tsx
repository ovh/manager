import { NavLink } from 'react-router-dom';

import { SWITCH_SIZE, Switch, SwitchItem } from '@ovhcloud/ods-react';

import { FeatureSwitcherProps } from './FeatureSwitcher.props';

export const FeatureSwitcher: React.FC<FeatureSwitcherProps> = (props) => {
  const { items, activeItemId } = props;
  return (
    <div className="h-10 flex justify-center items-center">
      <Switch
        id="feature-switcher"
        className="h-10"
        defaultValue={activeItemId}
        size={SWITCH_SIZE.md}
      >
        {items.map(({ id, link, onClick }) => (
          <NavLink
            key={`obs-feature-${id}`}
            to={link || ''}
            {...(onClick ? { onClick } : {})}
            className="no-underline"
          >
            <SwitchItem className="w-24 h-10" value={id}>
              <span className="px-2">{id}</span>
            </SwitchItem>
          </NavLink>
        ))}
      </Switch>
    </div>
  );
};

export default FeatureSwitcher;
