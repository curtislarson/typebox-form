export interface SchemaInputProps {
  id: string;
  title: string;
  type: "text" | "number" | "email";
  examples: string[];
  error?: string;

  value?: string;
  onChange: (id: string, val: string) => void;
}

export default function SchemaInput(props: SchemaInputProps) {
  return (
    <div>
      <label htmlFor={props.title} className="block text-sm font-medium text-gray-700">
        {props.title}
      </label>
      <div className="mt-1">
        <input
          type={props.type}
          name={props.title}
          id={props.title}
          data-testid={`${props.title}-input`}
          className={`shadow-sm block w-full sm:text-sm rounded-md ${
            props.error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
              : "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          }`}
          placeholder={props.examples[0]}
          value={props.value}
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              props.onChange(props.id, e.target.value);
            }
          }}
        />
      </div>
      {props.error && (
        <p className="mt-2 text-sm text-red-600" id={`${props.title}-error`}>
          {props.error}
        </p>
      )}
    </div>
  );
}
