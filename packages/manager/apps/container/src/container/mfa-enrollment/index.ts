import { useEffect, useState } from 'react';
import { useReket } from '@ovh-ux/ovh-reket';

export enum MfaEnrollmentState {
  HIDE,
  ASK,
  FORCED,
}

export default function useMfaEnrollment() {
  const [state, setState] = useState<MfaEnrollmentState>(
    MfaEnrollmentState.HIDE,
  );
  const reketInstance = useReket();

  useEffect(() => {
    reketInstance
      .get('/auth/shouldDisplayMFAEnrollment', {
        requestType: 'apiv6',
      })
      .then(({ value }: { value: string }) => {
        switch (value) {
          case 'forced':
            setState(MfaEnrollmentState.FORCED);
            break;
          case 'true':
            setState(MfaEnrollmentState.ASK);
            break;
          default:
            setState(MfaEnrollmentState.HIDE);
            break;
        }
      })
      .catch(() => {});
  }, []);

  return {
    isMfaEnrollmentVisible: state !== MfaEnrollmentState.HIDE,
    isMfaEnrollmentForced: state === MfaEnrollmentState.FORCED,
    hideMfaEnrollment: () => {
      setState(MfaEnrollmentState.HIDE);
    },
  };
}
