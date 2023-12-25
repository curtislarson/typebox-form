import { TypeGuard } from "@sinclair/typebox";
import SchemaInput from "./SchemaInput";
import { FormSchema } from "./types";
import SchemaCheckboxInput from "./SchemaCheckboxInput";
import { Signal } from "@preact/signals";

export interface SchemaInputControllerProps {
  schema: FormSchema;
}

function uppercaseFirst(val: string) {
  return `${val[0].toUpperCase()}${val.slice(1)}`;
}

export default function SchemaInputController(props: SchemaInputControllerProps) {
  const sharedProps = {
    id: props.schema.$id,
    label: props.schema.title ?? uppercaseFirst(props.schema.$id),
    examples: props.schema.examples
      ? Array.isArray(props.schema.examples)
        ? props.schema.examples
        : [props.schema.examples]
      : [],
    defaultValue: props.schema.default as string | undefined,
  };

  if (TypeGuard.IsDate(props.schema)) {
    return <SchemaInput {...sharedProps} type="date" value={props.schema.value} error={props.schema.error} />;
  } else if (TypeGuard.IsString(props.schema)) {
    if (props.schema.format) {
      if (props.schema.format === "email") {
        return <SchemaInput {...sharedProps} type="email" value={props.schema.value} error={props.schema.error} />;
      } else if (props.schema.format === "uri") {
        return <SchemaInput {...sharedProps} type="url" value={props.schema.value} error={props.schema.error} />;
      }
    }
    return <SchemaInput {...sharedProps} type="text" value={props.schema.value} error={props.schema.error} />;
  } else if (TypeGuard.IsNumber(props.schema) || TypeGuard.IsInteger(props.schema)) {
    return <SchemaInput {...sharedProps} type="number" value={props.schema.value} error={props.schema.error} />;
  } else if (TypeGuard.IsBoolean(props.schema)) {
    return (
      <SchemaCheckboxInput
        {...sharedProps}
        type="checkbox"
        value={props.schema.value as unknown as Signal<boolean>}
        error={props.schema.error}
      />
    );
  } else {
    return <></>;
  }
}
