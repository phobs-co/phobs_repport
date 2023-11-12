import { useField } from 'uniforms';
import { SelectField, TextField } from 'uniforms-bootstrap5';
import React from 'react';

const DetailDistributionField = ({ distributionValue, ...props }) => {
  const fieldProps = useField(props.name, props)[0]; // Add this line

  const distributionTypes = {
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };

  const options = Object.keys(distributionTypes).map(key => ({
    label: distributionTypes[key],
    value: parseInt(key, 10),
  }));

  return (distributionValue !== null && distributionValue !== undefined) || fieldProps.value
    ? <SelectField {...props} options={options} onChange={v => fieldProps.onChange(v)} value={fieldProps.value} />
    : <TextField {...props} value="The event has not been distributed." disabled />;
};

export default DetailDistributionField;
