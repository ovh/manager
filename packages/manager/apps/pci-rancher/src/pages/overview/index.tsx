import React from 'react';
import { useParams } from 'react-router-dom';

function OverView() {
  const { rancherId } = useParams();
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
      Overview : {rancherId}
    </div>
  );
}

export default OverView;
