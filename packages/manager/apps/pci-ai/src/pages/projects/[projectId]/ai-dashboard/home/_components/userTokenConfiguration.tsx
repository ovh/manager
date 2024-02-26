import { H1 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UsersTokensProps {
  activeTokens: number;
  activeUsers: number;
}

export default function UserTokenConfiguration({
  activeTokens,
  activeUsers,
}: UsersTokensProps) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center text-primary font-semibold border-primary-100 border bg-primary-100">
          <p className="text-lg py-2">Security</p>
        </div>
        <div className="border-primary-100 border h-48 max-h-96">
          <div className="grid w-full grid-cols-2 gap-4 ml-4">
            <div className="flex justify-center items-center mt-6">
              <Card className="border-primary bg-primary border text-white mt'6 h-24 w-24 py-5 px-5">
                <div className="flex flex-col items-center">
                  <H1>{activeUsers}</H1>
                  <p>Users</p>
                </div>
              </Card>
            </div>
            <div className="flex justify-center items-center mt-6">
              <Card className="border-primary bg-primary border text-white mt'6 h-24 w-24 py-5 px-5">
                <div className="flex flex-col items-center">
                  <H1>{activeTokens}</H1>
                  <p>Tokens</p>
                </div>
              </Card>
            </div>
          </div>
          <div className="border-slate-200 border-t mx-5 my-3"></div>
          <Button className="ml-2" variant="linkBis" size="sm" asChild>
            <Link to="./../users-tokens">
              Manage users and application tokens
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
