import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useShell } from '.';
import OvhContext from './ovh-context';

export default function OvhTracking() {
  const location = useLocation();
  const value = useContext(OvhContext);

  const shell = useShell();

  console.info('ovhContext value : ', value);

  useEffect(() => {
    console.info('init Tracking');
  }, []);

  const ohvTrackingAction = (event) => {
    console.info('******************************');
    console.info('location has change ohvTrackingAction : ', event);
  };

  useEffect(() => {
    console.info('*********************');
    console.info('location change : ', location);
  }, [location]);

  useEffect(() => {
    console.info('init window addEventListener');
    window.addEventListener('click', ohvTrackingAction, false);
    return () => {
      console.info('remove window addEventListener');
      window.removeEventListener('click', ohvTrackingAction, false);
    };
  }, []);

  return undefined;
}
