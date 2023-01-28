import { TObject } from "@sinclair/typebox";
import { useValidator } from "./use-validator";
import { useCallback, useMemo, useState } from "preact/hooks";
import { InputValue } from "./SchemaToInput";
import SchemaToFormGroup, { FormGroupValue } from "./SchemaToFormGroup";

export interface FormProps<T extends TObject> {
  title: string;
  schema: T;
}

export default function Form<T extends TObject>(props: FormProps<T>) {
  const { validate, errors } = useValidator(props.schema);
  const [data, setData] = useState<FormGroupValue>({});

  const onFormSubmit = useCallback((data: unknown) => {
    console.log("onSubmit", data);
    const validateRes = validate(data);
    console.log(validateRes);
  }, []);

  const onChange = useCallback(
    (id: string, val: InputValue) => {
      data[id] = val;
      setData({ ...data });
    },
    [setData]
  );

  return (
    <form data-testid={props.title} onSubmit={(e) => onFormSubmit(e)}>
      <SchemaToFormGroup name={props.title} onChange={onChange} schema={props.schema} value={data} />
    </form>
  );
}
