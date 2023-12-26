import { StringFormatOption, TypeGuard, Hint } from "@sinclair/typebox";
import SchemaInput from "./SchemaInput";
import { FormSchema } from "./types";
import SchemaCheckboxInput from "./SchemaCheckboxInput";
import { Signal } from "@preact/signals";
import SchemaSelectInput from "./SchemaSelectInput";

export interface SchemaInputControllerProps {
  schema: FormSchema;
}

function uppercaseFirst(val: string) {
  return `${val[0].toUpperCase()}${val.slice(1)}`;
}

function inputTypeFromFormat(format: StringFormatOption) {
  switch (format) {
    case "email":
      return "email";
    case "uri":
      return "url";
    case "password":
      return "password";
    default:
      return "text";
  }
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

  const schemaHint = props.schema[Hint];

  if (TypeGuard.IsDate(props.schema) || props.schema.format === "date") {
    return <SchemaInput {...sharedProps} type="date" value={props.schema.value} error={props.schema.error} />;
  } else if (TypeGuard.IsString(props.schema)) {
    if (props.schema.format) {
      return (
        <SchemaInput
          {...sharedProps}
          type={inputTypeFromFormat(props.schema.format)}
          value={props.schema.value}
          error={props.schema.error}
        />
      );
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
  } else if (schemaHint === "Enum" && "anyOf" in props.schema) {
    const anyOf = props.schema.anyOf as { const: string }[];
    const options = anyOf.map((o) => ({ text: o.const, value: o.const }));
    return (
      <SchemaSelectInput {...sharedProps} options={options} value={props.schema.value} error={props.schema.error} />
    );
  }
  {
    return <></>;
  }
}
