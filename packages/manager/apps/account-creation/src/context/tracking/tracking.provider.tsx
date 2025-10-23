import { useCallback, useEffect, useState } from 'react';
import { TrackingPlugin } from '@ovh-ux/shell';
import { Region, User } from '@ovh-ux/manager-config';
import {
  getClickProps,
  getPageProps,
  TrackingClickParams,
  TrackingPageParams,
} from '@ovh-ux/manager-react-shell-client';
import { DataUsagePolicy } from '@ovh-ux/manager-gcj-module';
import trackingContext from '@/context/tracking/tracking.context';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from '@/tracking.constant';

type Props = {
  region: Region;
  children: JSX.Element | JSX.Element[];
};

const tracking = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

export const TrackingProvider = ({
  region,
  children = [],
}: Props): JSX.Element => {
  const [plugin] = useState(new TrackingPlugin());
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    plugin.configureTracking(region, user);
  }, [region, user]);

  const trackPage = useCallback(
    (params: TrackingPageParams) => {
      plugin.trackPage(
        getPageProps({
          ...tracking,
          ...params,
          level2: tracking.level2Config[region].config.level2,
        }),
      );
    },
    [plugin, tracking],
  );

  const trackClick = useCallback(
    (
      pageTracking: TrackingPageParams,
      { location, buttonType, actions, actionType }: TrackingClickParams,
    ) => {
      plugin.trackClick(
        getClickProps({
          ...tracking,
          ...pageTracking,
          location,
          buttonType,
          actionType,
          actions,
          level2: tracking.level2Config[region].config.level2,
        }),
      );
    },
    [plugin, tracking],
  );

  const context = {
    setUser,
    trackPage,
    trackClick,
  };

  return (
    <trackingContext.Provider value={context}>
      {children}
      <DataUsagePolicy
        subsidiary={user?.ovhSubsidiary}
        trackingPlugin={plugin}
        region={region}
      />
    </trackingContext.Provider>
  );
};

export default TrackingProvider;
