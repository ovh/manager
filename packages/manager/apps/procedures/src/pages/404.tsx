import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound(): null {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
  }, []);

  return null;
}
