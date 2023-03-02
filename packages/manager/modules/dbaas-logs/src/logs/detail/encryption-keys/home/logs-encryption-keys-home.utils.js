/**
 * Converts a Datagrid criteria list to Iceberg filter predicates
 * @param name
 * @param operator
 * @param value
 * @return {{name: string, value: string, operator: string}|{name: string, value: string, operator: string}}
 */
const datagridToIcebergFilter = (name, operator, value) => {
  switch (operator) {
    case 'containsNot':
      return {
        name,
        operator: 'nlike',
        value: `*${value}*`,
      };
    case 'startsWith':
      return {
        name,
        operator: 'like',
        value: `${value}*`,
      };
    case 'endsWith':
      return {
        name,
        operator: 'like',
        value: `*${value}`,
      };
    case 'is':
      return {
        name,
        operator: 'eq',
        value,
      };
    case 'isNot':
      return {
        name,
        operator: 'neq',
        value,
      };
    default:
      return {
        name,
        operator: 'like',
        value: `*${value}*`,
      };
  }
};

export default datagridToIcebergFilter;
