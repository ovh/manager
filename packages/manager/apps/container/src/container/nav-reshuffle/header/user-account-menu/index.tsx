import React, { useRef, useState, useEffect } from 'react';

import { useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';
import { v6 } from '@ovh-ux/manager-core-api';
import useClickAway from 'react-use/lib/useClickAway';

import UserAccountMenuButton from './Button';
import UserAccountMenuContent from './Content';
import useOnboarding from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import { useShell } from '@/context';
import { useHeader } from '@/context/header';

import style from './style.module.scss';

type Props = {
  onToggle(show: boolean): void;
};

export const UserAccountMenu = ({ onToggle }: Props): JSX.Element => {
  const ref = useRef();
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const { setIsNotificationsSidebarVisible } = useHeader();

  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();
  const region = environment.getRegion();

  const {
    onboardingOpenedState,
    isAccountSidebarOpened,
    openAccountSidebar,
    closeAccountSidebar,
  } = useProductNavReshuffle();
  const onboardingHelper = useOnboarding();

  const ovhPaymentMethod = useOvhPaymentMethod({
    axiosInstance: v6,
    region,
  });

  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState(true);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);
  const handleRootClose = () => {
    if (!onboardingHelper.hasStarted(onboardingOpenedState)) {
      closeAccountSidebar();
    }
  };

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!defaultPaymentMethod && isAccountSidebarOpened && !user.enterprise) {
        try {
          setDefaultPaymentMethod(
            await ovhPaymentMethod.getDefaultPaymentMethod(),
          );
        } finally {
          setIsPaymentMethodLoading(false);
        }
      }

      onToggle(isAccountSidebarOpened);
    };

    loadPaymentMethods();
  }, [isAccountSidebarOpened]);

  useClickAway(ref, handleRootClose);

  return (
    <div className={`oui-navbar-dropdown ${style.selectable}`} ref={ref}>
      <UserAccountMenuButton
        show={isAccountSidebarOpened}
        onClick={(nextShow) => {
          if (nextShow) {
            openAccountSidebar();
            setIsNotificationsSidebarVisible(false);
            trackingPlugin.trackClick({
              type: 'action',
              name: 'topnav::user_widget::open',
            });
          } else {
            closeAccountSidebar();
          }
        }}
      >
        <span
          className={`${style.userIcon} oui-icon navbar-oui-icon oui-icon-user align-middle mr-2`}
        ></span>
        <span
          className={`${style.userInfos} align-middle`}
        >{`${user.firstname} ${user.name}`}</span>
      </UserAccountMenuButton>
      <UserAccountMenuContent
        defaultPaymentMethod={defaultPaymentMethod}
        isLoading={isPaymentMethodLoading}
      />
    </div>
  );
};

export default UserAccountMenu;
