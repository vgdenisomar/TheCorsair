import React from 'react';
import './Campo.css';
export default ( { caption , type,css, value, name , onChange, ...props } )=>{
  return (
    <fieldset>
      <legend  className={[css||""].join(" ")} >{caption}</legend>
      <input
        type={type||"text"}
        value={value||""}
        name={name}
        onChange={(onChange||function(){})}
      />
    </fieldset>
  );
};
