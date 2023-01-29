import { Signal } from "@preact/signals";

export type SchemaCheckboxInputProps = {
  type: "checkbox";
  id: string;
  label: string;
  examples: string[];
  error: Signal<string | undefined>;
  value: Signal<boolean>;
};

export default function SchemaCheckboxInput(props: SchemaCheckboxInputProps) {
  return (
    <div class="block">
      <div class="mt-3">
        <div>
          <label htmlFor={props.id} class="inline-flex items-center">
            <input
              type={props.type}
              name={props.id}
              id={props.id}
              data-testid={`${props.id}-input`}
              class={`shadow-sm block  sm:text-sm rounded-md ${
                props.error.peek()
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  : "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              }`}
              placeholder={props.examples[0]}
              checked={props.value}
              onChange={(e) => {
                if (e.target instanceof HTMLInputElement) {
                  props.value.value = !props.value.peek();
                  props.error.value = undefined;
                }
              }}
            />
            <span class="ml-2 text-sm font-medium text-gray-700">{props.label}</span>
          </label>
        </div>

        {props.error.value && (
          <p class="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
            {props.error}
          </p>
        )}
      </div>
    </div>
  );
}
