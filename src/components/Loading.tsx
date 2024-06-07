import React from 'react'
import { Spinner } from 'react-bootstrap'
import { useData } from '../hooks/useData';

function Loading() {
  const { data } = useData();

  if (!data) {
    return null;
  }

  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
}

export default Loading