import { TObject } from "@sinclair/typebox";
import SchemaToInput, { InputValue } from "./SchemaToInput";

export type FormGroupValue = Record<string, InputValue>;

export interface SchemaToFormGroupProps {
  name: string;
  schema: TObject;
  value: FormGroupValue;
  onChange: (id: string, val: InputValue) => void;
}

export default function SchemaToFormGroup({ name, schema, value, onChange }: SchemaToFormGroupProps) {
  return (
    <div class="mt-2">
      {Object.entries(schema.properties).map(([propName, prop]) => {
        if (prop.$id == null) {
          throw new Error("All provided schemas must contain an '$id' property!");
        }
        return <SchemaToInput name={propName} schema={prop} value={value[prop.$id]} onChange={onChange} />;
      })}
    </div>
  );
}
