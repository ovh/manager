import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useEstimate } from '@/hooks/useEstimate';
import { useGetAlert } from '@/api/hooks/useAlerting';

type TChartData = {
  estimate: {
    now: {
      value: number;
      currencyCode: string;
      label: string;
    };
    endOfMonth: {
      value: number;
      currencyCode: string;
      label: string;
    };
  };
  threshold: {
    now: {
      value: number;
      currencyCode: string;
      label: string;
    };
    endOfMonth: {
      value: number;
      currencyCode: string;
      label: string;
    };
  };
};

export const useChartData = (projectId: string) => {
  const { t: tEstimate } = useTranslation('estimate');
  const { currency } = useContext(ShellContext).environment.getUser();
  const [chartData, setChartData] = useState<TChartData>({
    estimate: {
      now: {
        value: 0,
        currencyCode: currency.symbol,
        label: tEstimate('cpbe_estimate_alert_chart_label_now'),
      },
      endOfMonth: {
        value: 0,
        currencyCode: currency.symbol,
        label: tEstimate('cpbe_estimate_alert_chart_label_future'),
      },
    },
    threshold: {
      now: {
        value: 0,
        currencyCode: currency.symbol,
        label: tEstimate('cpbe_estimate_alert_chart_label_limit'),
      },
      endOfMonth: {
        value: 0,
        currencyCode: currency.symbol,
        label: tEstimate('cpbe_estimate_alert_chart_label_limit'),
      },
    },
  });

  const currentEstimate = useEstimate(projectId, 'current');
  const totalEstimate = useEstimate(projectId, 'forecast');

  const { data: alert } = useGetAlert(projectId);

  useEffect(() => {
    if (alert) {
      setChartData((prev) => ({
        ...prev,
        threshold: {
          ...prev.threshold,
          endOfMonth: {
            ...prev.threshold.endOfMonth,
            value: alert.monthlyThreshold,
          },
          now: {
            ...prev.threshold.now,
            value: alert.monthlyThreshold,
          },
        },
      }));
    }
    if (currentEstimate) {
      setChartData((prev) => ({
        ...prev,
        estimate: {
          ...prev.estimate,
          now: {
            ...prev.estimate.now,
            value: currentEstimate.totalHourlyPrice,
          },
        },
      }));
    }
    if (totalEstimate) {
      setChartData((prev) => ({
        ...prev,
        estimate: {
          ...prev.estimate,
          endOfMonth: {
            ...prev.estimate.endOfMonth,
            value: totalEstimate.totalPrice,
          },
        },
      }));
    }
  }, [alert, currentEstimate, totalEstimate]);

  return chartData;
};
