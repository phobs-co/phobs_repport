import { useField } from 'uniforms';
import { SelectField, TextField } from 'uniforms-bootstrap5';
import React from 'react';

const DetailProtocolField = ({ protocolValue, ...props }) => {
  const fieldProps = useField(props.name, props)[0]; // This value gets updated when field changes.

  const protocolNames = {
    1: 'Measure and Dispose',
    2: 'Four Corners',
    3: 'One of All',
    4: 'Hybrid',
    5: 'Disentanglement',
    6: 'Reverse Engineer',
  };

  const options = Object.keys(protocolNames).map(key => ({
    label: protocolNames[key],
    value: parseInt(key, 10),
  }));

  return (protocolValue !== null && protocolValue !== undefined) || fieldProps.value
    ? <SelectField {...props} options={options} onChange={v => fieldProps.onChange(v)} value={fieldProps.value} />
    : <TextField {...props} value="The event does not have samples yet." disabled />;
};

export default DetailProtocolField;
