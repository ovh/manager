import React from 'react';

const ApplicationContext = React.createContext({
  environment: null,
});

// export const useApplication = () => React.useContext(EnvironmentContext);

export default ApplicationContext;
