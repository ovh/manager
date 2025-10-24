import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNashaServicesCheck } from '@/data/api/hooks/useNashaServices';

export default function RootPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useNashaServicesCheck();

  useEffect(() => {
    if (!isLoading && data) {
      if (data.hasServices) {
        navigate('listing', { replace: true });
      } else {
        navigate('onboarding', { replace: true });
      }
    }
  }, [data, isLoading, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading Nasha services</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
