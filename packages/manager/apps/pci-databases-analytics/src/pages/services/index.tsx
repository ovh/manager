import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Services = () => {
  const { category } = useParams();
  return (
    <>
      <p>Services {category}</p>
      <Link to="./new">Create a new service</Link>
    </>
  );
};

export default Services;
