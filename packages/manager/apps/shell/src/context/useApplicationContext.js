import { useContext } from 'react';
import ApplicationContext from './application.context';

export const useApplicationContext = (Context = ApplicationContext) => {
  return useContext(Context);
};

export default useApplicationContext;
