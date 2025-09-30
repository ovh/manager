import { Outlet } from 'react-router-dom';

const Logs = () => {
  return (
    <>
      <h2>Logs</h2>
      <Outlet />
    </>
  );
};

export default Logs;
