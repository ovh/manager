import React from 'react';

const EnvironmentContext = React.createContext({});

export const useEnvironment = () => React.useContext(EnvironmentContext);

export const { Provider } = EnvironmentContext;

export default {
  Provider,
  useEnvironment,
};
