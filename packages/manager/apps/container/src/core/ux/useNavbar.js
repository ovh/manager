import { useState } from 'react';

const useNavbar = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  return {
    notificationCount,
    setNotificationCount,
  };
};

export default useNavbar;
