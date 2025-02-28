import { useMemo } from 'react';

const COLORS_ELEMENTS = {
  input_tokens: { color: '#0050D7', labelKey: 'ai_endpoints_input' },
  output_tokens: { color: '#A5E9FF', labelKey: 'ai_endpoints_output' },
  seconds: { color: '#0050D7', labelKey: 'ai_endpoints_totalAudio' },
} as const;

type UnitType = keyof typeof COLORS_ELEMENTS;
type DataMap = Partial<Record<UnitType, number[]>>;

const useChartData = (
  dataMap: DataMap,
  labels: string[],
  isLoading: boolean,
  t: (key: string) => string,
) => {
  return useMemo(() => {
    if (isLoading || !dataMap || Object.keys(dataMap).length === 0) {
      return null;
    }

    return {
      labels,
      datasets: Object.entries(dataMap)
        .map(([unit, data]) => {
          if (!(unit in COLORS_ELEMENTS)) return null;

          const element = COLORS_ELEMENTS[unit as UnitType];

          return {
            label: t(element.labelKey),
            data,
            borderColor: element.color,
            backgroundColor: element.color,
            tension: 0.4,
          };
        })
        .filter(Boolean),
    };
  }, [dataMap, labels, isLoading, t]);
};

export default useChartData;
