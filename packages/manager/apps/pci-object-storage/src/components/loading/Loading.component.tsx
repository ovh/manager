import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div className="flex justify-center" data-testid="loading-container">
    <div>
      <Loader2
        data-testid="osds-spinner"
        className="w-16 h-16 my-20 animate-spin"
      />
    </div>
  </div>
);

export default Loading;
