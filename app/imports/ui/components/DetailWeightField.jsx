import React from 'react';
import { useField } from 'uniforms';
import { TextField } from 'uniforms-bootstrap5';
import { Button, Modal } from 'react-bootstrap';

const DetailWeightField = (props) => {
  const [show, setShow] = React.useState(false);
  const [weight, setWeight] = React.useState(0);
  const [unit, setUnit] = React.useState('kg'); // default unit

  const field = useField(props.name, props, { initialValue: false })[0];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const saveWeight = () => {
    const convertedWeight = unit === 'lbs' ? parseFloat(weight) * 0.45359237 : parseFloat(weight);
    field.onChange(convertedWeight);
    handleClose();
  };

  return (
    <>
      { field.value !== undefined && !Number.isNaN(parseFloat(field.value))
        ? <TextField {...props} value={`${field.value.toFixed(2)} kg`} disabled />
        : <TextField {...props} value="This event does not yet have a recorded weight." disabled /> }
      <Button variant={field.value !== undefined && !Number.isNaN(parseFloat(field.value)) ? 'outline-secondary' : 'primary'} onClick={handleShow}>
        { field.value !== undefined && !Number.isNaN(parseFloat(field.value)) ? 'Adjust Weight' : 'Add Weight' }
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Weight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="number" step="0.01" min="0.01" value={weight} onChange={handleWeightChange} />
          <select value={unit} onChange={handleUnitChange}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveWeight}>
            Save Weight
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DetailWeightField;
