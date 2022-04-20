import React, { useRef, useState, useEffect } from 'react';

import { useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';
import { useReket } from '@ovh-ux/ovh-reket';
import useClickAway from 'react-use/lib/useClickAway';

import UserAccountMenuButton from './Button';
import UserAccountMenuContent from './Content';

import { useShell } from '@/context';

import style from './style.module.scss';

type Props = {
  onToggle(show: boolean): void;
};

export const UserAccountMenu = ({ onToggle }: Props): JSX.Element => {
  const ref = useRef();
  const shell = useShell();

  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();
  const region = environment.getRegion();

  const ovhPaymentMethod = useOvhPaymentMethod({
    reketInstance: useReket(),
    region,
  });

  const [show, setShow] = useState(false);
  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState(true);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);
  const handleRootClose = () => {
    setShow(false);
  };

  useEffect(async () => {
    if (!defaultPaymentMethod && show && !user.enterprise) {
      try {
        setDefaultPaymentMethod(
          await ovhPaymentMethod.getDefaultPaymentMethod(),
        );
      } finally {
        setIsPaymentMethodLoading(false);
      }
    }

    onToggle(show);
  }, [show]);

  useClickAway(ref, handleRootClose);

  return (
    <div className="oui-navbar-dropdown" ref={ref}>
      <UserAccountMenuButton
        show={show}
        onClick={(nextShow) => {
          setShow(nextShow);
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
