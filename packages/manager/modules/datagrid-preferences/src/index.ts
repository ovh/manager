import { debounce, snakeCase } from 'lodash-es';

const PREFIX = 'DATAGRID_CONFIG_';
const DEBOUNCE = 2000;

export const retrieveColumnsConfig = async (datagridId: string) => {
  const key = `${PREFIX}${snakeCase(datagridId).toUpperCase()}`;
  const config = await fetch(`/engine/api/me/preferences/manager/${key}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  });

  if (config.ok) {
    const { value } = await config.json();
    return JSON.parse(value);
  }

  return null;
};

export const saveColumnsConfig = debounce(
  async (datagridId: string, columnsConfig: unknown) => {
    const key = `${PREFIX}${snakeCase(datagridId).toUpperCase()}`;
    const ret = await fetch(`/engine/api/me/preferences/manager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        key,
        value: JSON.stringify(columnsConfig),
      }),
    });

    if (ret.ok) {
      return ret.json();
    }

    return null;
  },
  DEBOUNCE,
);
