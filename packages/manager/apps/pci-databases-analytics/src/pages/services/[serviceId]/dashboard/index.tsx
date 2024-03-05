import { H2 } from '@/components/typography';
import { useServiceData } from '../layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard = () => {
  const { service } = useServiceData();
  return (
    <>
      <H2>dashboard</H2>
      <ul className="list-disc list-inside">
        <li className="list-item">Cluster info</li>
        <li className="list-item">Connection info</li>
        <li className="list-item">Integrations</li>
        <li className="list-item">Relevant metrics ?</li>
        <li className="list-item">
          Starting steps (service ready / add ip / add users)
        </li>
        <li className="list-item">Guides</li>
        <li className="list-item">Support ?</li>
        <li className="list-item">Billing ?</li>
      </ul>
      <ScrollArea className="p-2 h-[500px] bg-[#122844] text-white whitespace-pre">
        {JSON.stringify(service, null, 2)}
      </ScrollArea>
    </>
  );
};

export default Dashboard;
