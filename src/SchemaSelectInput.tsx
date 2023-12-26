import { Signal } from "@preact/signals";

export interface Option {
  value: string;
  text: string;
}

export interface SchemaSelectInputProps {
  id: string;
  label: string;
  options: Option[];
  error: Signal<string | undefined>;
  value: Signal<string | number>;
}

export default function SchemaSelectInput(props: SchemaSelectInputProps) {
  return (
    <>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <select
        id={props.id}
        className={`mt-1 block w-full rounded-md shadow-sm ${
          props.error.peek()
            ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        }`}
        value={props.value}
        onChange={(e) => {
          if (e.target instanceof HTMLSelectElement) {
            const value = e.target.value;
            props.value.value = value;
            props.error.value = undefined;
          }
        }}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    </>
  );
}
