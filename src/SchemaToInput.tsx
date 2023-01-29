import { TypeGuard } from "@sinclair/typebox/guard";
import SchemaInput from "./SchemaInput";
import { FNumber, FString } from "./types";

export interface SchemaToInputProps {
  schema: FNumber | FString;
}

export default function SchemaToInput(props: SchemaToInputProps) {
  if (props.schema.$id == null) {
    throw new Error("All provided schemas must contain an '$id' property!");
  }
  const sharedProps = {
    id: props.schema.$id,
    label: props.schema.title ?? props.schema.$id,
    examples: props.schema.examples
      ? Array.isArray(props.schema.examples)
        ? props.schema.examples
        : [props.schema.examples]
      : [],
  };

  if (TypeGuard.TString(props.schema)) {
    return <SchemaInput {...sharedProps} type="text" value={props.schema.value} error={props.schema.error} />;
  } else if (TypeGuard.TNumber(props.schema)) {
    return <SchemaInput {...sharedProps} type="number" value={props.schema.value} error={props.schema.error} />;
  } else {
    return <></>;
  }
}
