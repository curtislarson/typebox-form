import { TObject, TProperties, TSchema } from "@sinclair/typebox";
import { useCallback, useMemo, useId } from "preact/hooks";
import { FNumber, FPrimitive, FString } from "./types";
import { TargetedEvent } from "preact/compat";
import { signal, computed, batch } from "@preact/signals";
import { TypeGuard } from "@sinclair/typebox/guard";
import SchemaToInput from "./SchemaToInput";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { Value, ValuePointer } from "@sinclair/typebox/value";

export function createReactivePrimitiveSchema(schema: TSchema) {
  return Object.assign(schema, {
    value: signal<string | number | undefined>(undefined),
    error: signal<string | undefined>(undefined),
  }) as FString | FNumber;
}

export function createReactiveSchema(properties: TProperties): [string, FPrimitive][] {
  return Object.values(properties).flatMap((schema) => {
    if (schema.$id == null) {
      console.warn(`Assigning missing $id to schema: ${JSON.stringify(schema)}`);
      schema.$id = useId();
    }
    const idPath = `/${schema.$id}`;
    if (TypeGuard.TObject(schema)) {
      const subSchemas: [string, FPrimitive][] = createReactiveSchema(schema.properties).map(([subId, subSchema]) => [
        `${idPath}${subId}`,
        subSchema,
      ]);
      return subSchemas;
    } else {
      return [[idPath, createReactivePrimitiveSchema(schema)]];
    }
  });
}

export interface TypeBoxFormProps<T extends TObject> {
  title: string;
  schema: T;
}

export default function TypeBoxForm<T extends TObject>(props: TypeBoxFormProps<T>) {
  const { Check, data, reactiveSchema } = useMemo(() => {
    const Check = TypeCompiler.Compile(props.schema);
    const reactive = createReactiveSchema(props.schema.properties);
    const initial = Value.Create(props.schema);
    const data = computed(() => {
      reactive.forEach(([pointer, schema]) => {
        ValuePointer.Set(initial, pointer, schema.value.value);
      });
      return initial;
    });

    // const errors = computed(() => reactiveSchema.map((r) => r[1].error));
    return {
      Check,
      data,
      reactiveSchema: Object.fromEntries(reactive),
    };
  }, [props.schema]);

  const onFormSubmit = useCallback(
    (e: TargetedEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("onSubmit", reactiveSchema, data.value);
      if (Check.Check(data.value)) {
        console.log("is valid");
      } else {
        const errors = [...Check.Errors(data.value)];
        console.log("errors=", errors);
        batch(() => {
          errors.forEach((err) => {
            reactiveSchema[err.path].error.value = err.message;
          });
        });
      }
    },
    [reactiveSchema, Check, data]
  );

  return (
    <div>
      <h1 class="text-lg leading-6 font-medium text-gray-900">{props.title}</h1>
      <form class="mt-6" data-testid={props.title} onSubmit={(e) => onFormSubmit(e)}>
        {Object.values(reactiveSchema).map((schema) => (
          <div class="mb-2">
            <SchemaToInput key={schema.$id} schema={schema} />
          </div>
        ))}
        <div>
          <button type="submit" class="px-5 py-2.5 mr-2 mb-2 text-sm text-white bg-blue-700">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
