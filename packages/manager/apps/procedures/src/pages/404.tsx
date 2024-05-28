import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rootRoute } from '@/routes/routes';

export default function NotFound(): null {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(rootRoute, { replace: true });
  }, []);

  return null;
}
