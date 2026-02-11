import { useState,useEffect } from 'react';
import { apiClient } from '@ovh-ux/manager-core-api';

export const useEventSource = (eventsBaseUrl = '/engine/events') => {
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [suscribeStatus, setSuscribeStatus] = useState<number | null>(null);
    const [eventSource, setEventSource] = useState<EventSource | null>(null);

     // 1. Create subscription
    const openSubscription = async () => {
      try {
        const response = await apiClient.events.post('/subscription');
        const { id } = response?.data as { id?: string };
        if (id) {
          setSubscriptionId(id);
        }
      } catch (error) {
        console.info('Failed to get subscription:', error);
      }
    };

    // 2. Activate subscription
    const activateSubscription = async () => {
      try {
        if (import.meta.env.DEV) {
          return Promise.resolve({
            status: 200,
            data: {
              subscriptionId: '1234567890',
            },
          });
        }
        const response = await apiClient.events.post('/subscription', { subscriptionId });
        setSuscribeStatus(response.status);
      } catch (error) {
        console.info('Failed to activate subscription:', error);
      }
    };

    // 3. Listen to events
    const listenToEvents = async () => {
      if (suscribeStatus === 200) {
        try {
          const eventSource = new EventSource(`${eventsBaseUrl}/subscription/${subscriptionId}`);
          setEventSource(eventSource);
        } catch (error) {
          console.info('Failed to listen to events:', error);
        }
      }
    };

    useEffect(() => {
        openSubscription();
    }, []);

    useEffect(() => {
      if (subscriptionId) {
        activateSubscription();
      }
    }, [subscriptionId]);

    useEffect(() => {
      if (suscribeStatus === 200) {
        listenToEvents();
      }
    }, [suscribeStatus]);

    return {
      subscriptionId,
      suscribeStatus,
      eventSource,
    };
  };
