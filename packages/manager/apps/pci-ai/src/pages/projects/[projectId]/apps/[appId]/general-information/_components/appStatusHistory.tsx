import { Check } from 'lucide-react';
import { ai } from '@/models/types';
interface HistoryStatusProps {
  history: { date: string; state: ai.app.AppStateEnum }[];
}

const AppStatusHistory = ({ history }: HistoryStatusProps) => {
  return (
    <>
      {history.map((item, index) => (
        <div key={index} className='flex flex-row'>
            <div className='basis-1/4'>
            <Check className="h-4 w-4" />
            </div>
            <div className='basis-1/4'>
            <p className = 'text-sm'>{item.state}</p>
            </div>
            <div className='basis-1/2'>
            <p className = 'text-sm text-right'>{Intl.DateTimeFormat('fr-FR', {day: '2-digit', month:'2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(item.date))}</p>
            </div>
        </div>
      ))}
    </>
  );
};

export default AppStatusHistory;