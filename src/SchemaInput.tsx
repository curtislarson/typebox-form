import { Signal } from "@preact/signals";

export type InputType = "text" | "number" | "email" | "date" | "url" | "password";

export type SchemaInputProps = {
  type: InputType;
  id: string;
  label: string;
  examples: string[];
  defaultValue?: string;
  error: Signal<string | undefined>;
  value: Signal<string | number>;
};

export default function SchemaInput(props: SchemaInputProps) {
  return (
    <>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div className="mt-1">
        <input
          type={props.type}
          name={props.id}
          id={props.id}
          defaultValue={props.defaultValue}
          data-testid={`${props.id}-input`}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            props.error.peek()
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          }`}
          placeholder={props.examples[0]}
          value={props.value}
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              const value = props.type === "number" ? Number(e.target.value) : e.target.value;
              props.value.value = value;
              props.error.value = undefined;
            }
          }}
        />
      </div>
      {props.error.value && (
        <p className="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
          {props.error}
        </p>
      )}
    </>
  );
}
