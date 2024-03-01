import { H2 } from '@/components/typography';
import { useServiceData } from '../layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard = () => {
  const { service } = useServiceData();
  return (
    <>
      <H2>dashboard</H2>
      <ScrollArea className="p-2 h-[500px] bg-[#122844] text-white whitespace-pre">
        {JSON.stringify(service, null, 2)}
      </ScrollArea>
    </>
  );
};

export default Dashboard;
