import { useParams } from 'react-router-dom';

export default function UsersTokens() {
  const { projectId } = useParams();

  return (
    <>
      <h1>Users Tokens</h1>
    </>
  );
}
