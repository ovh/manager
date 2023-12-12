import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UsersPage = () => {
  return (
    <>
      Users page
      <Button asChild>
        <Link to="add">Add a user</Link>
      </Button>
    </>
  );
};

export default UsersPage;
