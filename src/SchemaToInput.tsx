import { TypeGuard } from "@sinclair/typebox/guard";
import SchemaInput from "./SchemaInput";
import { FNumber, FString } from "./types";

export interface SchemaToInputProps {
  schema: FNumber | FString;
}

function uppercaseFirst(val: string) {
  return `${val[0].toUpperCase()}${val.slice(1)}`;
}

export default function SchemaToInput(props: SchemaToInputProps) {
  const sharedProps = {
    id: props.schema.$id,
    label: props.schema.title ?? uppercaseFirst(props.schema.$id),
    examples: props.schema.examples
      ? Array.isArray(props.schema.examples)
        ? props.schema.examples
        : [props.schema.examples]
      : [],
  };

  if (TypeGuard.TString(props.schema)) {
    if (props.schema.format) {
      if (props.schema.format === "email") {
        return <SchemaInput {...sharedProps} type="email" value={props.schema.value} error={props.schema.error} />;
      }
    }
    return <SchemaInput {...sharedProps} type="text" value={props.schema.value} error={props.schema.error} />;
  } else if (TypeGuard.TNumber(props.schema)) {
    return <SchemaInput {...sharedProps} type="number" value={props.schema.value} error={props.schema.error} />;
  } else {
    return <></>;
  }
}
