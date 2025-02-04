import { useMemo } from 'react';

type DataMap = Record<string, number[]>;

const useChartData = (
  dataMap: DataMap,
  labels: string[],
  isLoading: boolean,
  t: (key: string) => string,
) => {
  return useMemo(() => {
    // Si on est en train de charger, retourner null pour afficher un loader côté composant
    if (isLoading || !dataMap || Object.keys(dataMap).length === 0) {
      return null;
    }

    return {
      labels,
      datasets: Object.keys(dataMap)
        .map((unit) => {
          let color = '';
          let label = '';

          switch (unit) {
            case 'input_tokens':
              color = '#0050D7';
              label = t('input');
              break;
            case 'output_tokens':
              color = '#A5E9FF';
              label = t('output');
              break;
            case 'seconds':
              color = '#0050D7';
              label = t('totalAudio');
              break;
            default:
              // Ne pas inclure les unités inconnues
              return null;
          }

          return {
            label, // Le label doit être celui retourné par t() après la traduction
            data: dataMap[unit],
            borderColor: color,
            backgroundColor: color.replace('1)', '0.2)'),
            tension: 0.4,
          };
        })
        .filter(Boolean), // Filtrer les datasets qui sont 'null'
    };
  }, [dataMap, labels, isLoading, t]);
};

export default useChartData;
