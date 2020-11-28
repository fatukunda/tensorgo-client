import { useState } from "react";

export const useFormFields = (initialState) => {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    (event) => {
      setValues({
        ...fields,
        [event.target.name]: event.target.value,
      });
    },
  ];
};
