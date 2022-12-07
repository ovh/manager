export const CSV_HEADERS = [
  {
    key: 'ipBlock',
    getValue: ({ ipBlock }) => ipBlock?.toString() || '',
  },
  {
    key: 'ipVersion',
    getValue: ({ version }) => version?.toString() || '',
  },
  {
    key: 'type',
    getValue: ({ type }) => type?.toString() || '',
  },
  {
    key: 'country',
    getValue: ({ country }) => country?.toString() || '',
  },
  {
    key: 'service',
    getValue: ({ service }) => service?.serviceName?.toString() || '',
  },
  {
    key: 'description',
    getValue: ({ description }) => description?.toString() || '',
  },
];

export const CSV_FILENAME = 'export_ips.csv';
export const CSV_DATA_ENCODING = 'base64';
export const CSV_DATA_SCHEME = `data:text/csv;charset=ISO-8859-1;${CSV_DATA_ENCODING}`;
export const CSV_SEPARATOR = { SCHEME: ',', ROW: '\n', CELL: ';' };

export default {
  CSV_HEADERS,
  CSV_FILENAME,
  CSV_DATA_ENCODING,
  CSV_DATA_SCHEME,
  CSV_SEPARATOR,
};
