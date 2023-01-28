import { TSchema } from "@sinclair/typebox";
import { TypeGuard } from "@sinclair/typebox/guard";
import SchemaInput from "./SchemaInput";

export type InputValue = string | number | boolean;

export interface SchemaToInputProps {
  name: string;
  schema: TSchema;
  value?: InputValue;
  onChange: (id: string, val: InputValue) => void;
}

export default function SchemaToInput({ name, schema, value, onChange }: SchemaToInputProps) {
  if (schema.$id == null) {
    throw new Error("All provided schemas must contain an '$id' property!");
  }
  const sharedProps = {
    id: schema.$id,
    title: schema.title ?? name,
    examples: schema.examples ? (Array.isArray(schema.examples) ? schema.examples : [schema.examples]) : [],
    value,
    onChange,
  };
  if (TypeGuard.TString(schema)) {
    return <SchemaInput type="text" {...sharedProps} />;
  } else if (TypeGuard.TNumber(schema)) {
    return <SchemaInput type="number" {...sharedProps} />;
  } else if (TypeGuard.TObject(schema)) {
    return Object.entries(schema.properties).map(([propName, prop]) => (
      <SchemaToFormGroup name={propName} schema={prop} value={} />
    ));
  } else {
    return <SchemaInput type="text" {...sharedProps} />;
  }
}
