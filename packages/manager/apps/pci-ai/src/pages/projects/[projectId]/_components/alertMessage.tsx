import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export type Message = {
  type?: 'default' | 'destructive' | 'success';
  title: string;
  content: JSX.Element;
};

interface AlertMessageProps {
  messages: Message[];
  deleteMessages: () => void;
}

const AlertMessage = ({ messages, deleteMessages }: AlertMessageProps) => {
  const deleteAndForward = () => {
    deleteMessages();
  };
  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        {messages.map((m, i) => (
          <Alert variant={m.type} key={i}>
            <AlertTitle>{m.title}</AlertTitle>
            <AlertDescription>{m.content}</AlertDescription>
            <Button
              onClick={() => deleteAndForward()}
              className="w-4 h-4 absolute right-2 top-2"
              variant="transparent"
            >
              <XCircle className="w-4 h-4"></XCircle>
            </Button>
          </Alert>
        ))}
      </div>
    </>
  );
};

export default AlertMessage;
