type DisplayBandwidth = {
  value: string;
  unit: 'MB' | 'GB' | 'TB';
};

const formatNumberWithDecimal = (input: number, baseNumber: number): string => {
  return input % baseNumber
    ? (Math.floor((100 * input) / baseNumber) / 100).toFixed(2)
    : `${input / baseNumber}`;
};

export const converToDisplayBandwidth = (mbpsBandwidth: number): DisplayBandwidth =>
  [
    {
      predicate: () => mbpsBandwidth >= 1000000,
      process: (): DisplayBandwidth => ({
        value: formatNumberWithDecimal(mbpsBandwidth, 1000000),
        unit: 'TB',
      }),
    },
    {
      predicate: () => mbpsBandwidth >= 1000,
      process: (): DisplayBandwidth => ({
        value: formatNumberWithDecimal(mbpsBandwidth, 1000),
        unit: 'GB',
      }),
    },
  ]
    .find(({ predicate }) => predicate())
    ?.process() ?? { value: `${mbpsBandwidth}`, unit: 'MB' };
