import { useEffect, useState } from 'react';
import { Application } from '@ovh-ux/manager-config';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import {
  BETA_ACKNOWLEDGED_STORAGE_KEY,
  NAV_RESHUFFLE_BETA_ACCESS_PREFERENCE_KEY,
  BETA_VERSION,
} from './container.constants';
import { useLocalStorage } from 'react-use';
import { BetaVersion, ContainerContext, ContainerContextType } from './container.context';
import { useShell } from '@/context';
import { v6 } from '@ovh-ux/manager-core-api';

export const ContainerProvider = ({ children }: { children: JSX.Element }) => {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotReduced, setChatbotReduced] = useState(false);
  const [application, setApplication] = useState<Application>(undefined);
  const [universe, setUniverse] = useState<string>();
  const isUS = shell?.getPlugin('environment')?.getEnvironment()?.getRegion() === 'US';

  // 1 for beta, otherwise null if not a beta tester
  const [betaVersion, setBetaVersion] = useState<BetaVersion | string>(null);

  // user choice about using or not the beta
  const [useBeta, setUseBeta] = useState(false);

  const [betaAcknowledged, setBetaAcknowledged] = useLocalStorage<boolean>(
    BETA_ACKNOWLEDGED_STORAGE_KEY,
  );

  const [isLivechatEnabled, setIsLivechatEnabled] = useState(false);

  const { data: availability, isLoading } = useFeatureAvailability([
    'livechat',
    'pnr',
  ]);

  const fetchBetaAcknowledged = async () => {
    if (betaAcknowledged) return true;

    if (!isUS) {
    return v6
      .get<boolean>(`/me/preferences/manager/${BETA_ACKNOWLEDGED_STORAGE_KEY}`)
      .then((response) => {
        const data: any = response.data;
        return JSON.parse(data.value) as boolean;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          return false;
        }
        throw error;
      });
    }

    return availability['pnr'];
  };

  const acknowledgeBeta = (value = true) => {
    v6.post('/me/preferences/manager', {
      key: BETA_ACKNOWLEDGED_STORAGE_KEY,
      value: JSON.stringify(value),
    }).then(() => {
      setBetaAcknowledged(value);
    });
  };

  /**
   * Function group to update the PNR beta status
   * We don't use useQuery here, since the window.location.reload() clears the cache
   */
  const fetchBetaChoice = async () =>
    v6
      .get<boolean>(
        `/me/preferences/manager/${NAV_RESHUFFLE_BETA_ACCESS_PREFERENCE_KEY}`,
      )
      .then((response) => {
        const data: any = response.data;
        setUseBeta(isUS ? JSON.parse(data.value) as boolean : true);
      })
      .catch((error) => {
        if (error.response.status !== 404) {
          // if not set, create with value false (legacy navigation)
          // to be removed after MANAGER-16732 / PR #15391
          createBetaChoice(false);
        }
      });

  // to be removed after MANAGER-16732 / PR #15391
  const createBetaChoice = async (accept = false) =>
    v6
      .post(
        `/me/preferences/manager`,
        {
          key: NAV_RESHUFFLE_BETA_ACCESS_PREFERENCE_KEY,
          value: JSON.stringify(accept),
        },
      )
      .catch((error) => {
        throw error;
      });

  const updateBetaChoice = async (accept = false) =>
    v6
      .put(
        `/me/preferences/manager/${NAV_RESHUFFLE_BETA_ACCESS_PREFERENCE_KEY}`,
        {
          key: NAV_RESHUFFLE_BETA_ACCESS_PREFERENCE_KEY,
          value: JSON.stringify(accept),
        },
      ).catch(async (error) => {
        if (error.response.status === 404) {
          await createBetaChoice(accept);
        } else {
          throw error;
        }
      })
      .finally(() => {
        window.location.reload();
      });

  /**
   * Initialisation is done here, we check if the user is a beta tester,
   * then we check his preferences regarding using or not the beta version.
   * If he has not preferences saved, we set askBeta to true in order
   * to provide him the choice.
   */
  useEffect(() => {
    if (availability) {
      setIsLivechatEnabled(availability.livechat);

      if (availability.pnr) {
        setBetaVersion(BETA_VERSION);
        fetchBetaChoice();
      }
    }
  }, [availability]);

  useEffect(() => {
    uxPlugin.onChatbotVisibilityChange(async () => {
      const chatbotVisibility = await uxPlugin.isChatbotVisible();
      if (isLivechatEnabled) {
        setChatbotOpen(chatbotVisibility);
      }
    });
  }, [isLivechatEnabled]);

  useEffect(() => {
    // special HPC case
    if (window.location.hash?.endsWith('hosted-private-cloud')) {
      return;
    }
    if (application?.universe) {
      setUniverse(application.universe);
    }
  }, [application]);

  useEffect(() => {
    fetchBetaAcknowledged().then((acknowledged) => {
      setBetaAcknowledged(acknowledged);
    });

    shell.getPlugin('environment').onUniverseChange((universe: string) => {
      setUniverse(universe);
    });
  }, []);

  const containerContext: ContainerContextType = {
    betaVersion,
    useBeta,
    betaAcknowledged,
    acknowledgeBeta,
    isLivechatEnabled,
    isLoading,
    updateBetaChoice,
    chatbotOpen,
    setChatbotOpen,
    chatbotReduced,
    setChatbotReduced,
    application,
    setApplication,
    universe: universe || application?.universe,
    setUniverse(universe: string) {
      shell.getPlugin('environment').setUniverse(universe);
    },
  };

  return (
    <ContainerContext.Provider value={containerContext}>
      {children}
    </ContainerContext.Provider>
  );
};

export default ContainerProvider;
