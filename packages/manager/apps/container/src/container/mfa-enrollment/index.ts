import { useEffect, useState } from 'react';
import { v6 } from '@ovh-ux/manager-core-api';

export enum MfaEnrollmentState {
  HIDE,
  ASK,
  FORCED,
}

export default function useMfaEnrollment() {
  const [state, setState] = useState<MfaEnrollmentState>(
    MfaEnrollmentState.HIDE,
  );
  useEffect(() => {
    v6.get('/auth/shouldDisplayMFAEnrollment')
      .then(({ data }: { data: string }) => {
        switch (data) {
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
      .catch(() => { });
  }, []);

  return {
    isMfaEnrollmentVisible: state !== MfaEnrollmentState.HIDE,
    isMfaEnrollmentForced: state === MfaEnrollmentState.FORCED,
    hideMfaEnrollment: () => {
      setState(MfaEnrollmentState.HIDE);
    },
  };
}
