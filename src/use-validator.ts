import { Static, TObject } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { useCallback, useMemo, useState } from "preact/hooks";

type PropertyKeys<S> = S extends TObject ? keyof TObject["properties"] : never;
type Errors<S extends TObject> = Partial<Record<PropertyKeys<S>, string>>;

export function useValidator<T extends TObject>(schema: T) {
  const C = useMemo(() => TypeCompiler.Compile(schema), [schema]);
  const [errors, setErrors] = useState<Errors<T>>({});
  // const [validData, setValidData] = useState<Static<T> | null>(null);

  const validate = useCallback(
    (data: unknown) => {
      if (C.Check(data)) {
        setErrors({});
        return data;
      } else {
        const errs = [...C.Errors(data)].reduce<Errors<T>>((acc, curr) => {
          acc[curr.path.split("/").pop() as PropertyKeys<T>] = curr.message;
          return acc;
        }, {});
        setErrors(errs);
        return null;
      }
    },
    [setErrors],
  );

  return { errors, validate };
}
