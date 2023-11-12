import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import React from 'react';

const DisposedItem = ({ stuff }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  const distributionTypes = {
    0: 'Not reported',
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };
  const distributionType = distributionTypes[stuff.distribution];

  return (
    <tr>
      <td>{distributionType}</td>
      <td>{stuff.type}</td>
      <td><Button variant="secondary" onClick={handleDetailsClick}><PencilSquare /></Button></td>
    </tr>
  );
};

export default DisposedItem;
