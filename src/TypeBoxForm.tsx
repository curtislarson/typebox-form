import { Static, TObject, TProperties, TSchema } from "@sinclair/typebox";
import { useCallback, useMemo } from "preact/hooks";
import { FormSchema } from "./types";
import { TargetedEvent } from "preact/compat";
import { signal, computed, batch } from "@preact/signals";
import { TypeGuard } from "@sinclair/typebox/guard";
import SchemaToInput from "./SchemaToInput";
import { TypeCompiler, ValueError } from "@sinclair/typebox/compiler";
import { ValuePointer } from "@sinclair/typebox/value";

function createReactivePrimitiveSchema(schema: TSchema) {
  return Object.assign(schema, {
    value: signal<string | number | undefined>(undefined),
    error: signal<string | undefined>(undefined),
  }) as FormSchema;
}

function createReactiveSchema(properties: TProperties): [string, FormSchema][] {
  return Object.entries(properties).flatMap(([propName, schema]) => {
    if (schema.$id == null) {
      schema.$id = propName;
    }
    const idPath = `/${schema.$id}`;
    if (TypeGuard.TObject(schema)) {
      const subSchemas: [string, FormSchema][] = createReactiveSchema(schema.properties).map(([subId, subSchema]) => [
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
  schema: T;
  title?: string;
  onFormSubmit?: (data: Static<T>) => void;
  onFormError?: (errors: ValueError[]) => void;
}

export default function TypeBoxForm<T extends TObject>({
  schema,
  title,
  onFormError,
  onFormSubmit,
}: TypeBoxFormProps<T>) {
  const { Check, data, reactiveSchema } = useMemo(() => {
    const Check = TypeCompiler.Compile(schema);
    const reactive = createReactiveSchema(schema.properties);
    const data = computed(() => {
      const initial = {};
      reactive.forEach(([pointer, schema]) => {
        ValuePointer.Set(initial, pointer, schema.value.value);
      });
      return initial;
    });

    return {
      Check,
      data,
      reactiveSchema: Object.fromEntries(reactive),
    };
  }, [schema]);

  const onSubmit = useCallback(
    (e: TargetedEvent<EventTarget, Event>) => {
      e.preventDefault();
      if (Check.Check(data.value)) {
        if (onFormSubmit) {
          onFormSubmit(data.value);
        }
      } else {
        const errors = [...Check.Errors(data.value)];
        batch(() => {
          errors.forEach((err) => {
            reactiveSchema[err.path].error.value = err.message;
          });
        });
        if (onFormError) {
          onFormError(errors);
        }
      }
    },
    [reactiveSchema, Check, data, onFormSubmit, onFormError]
  );

  return (
    <div>
      {title && <h1 class="text-lg leading-6 font-medium text-gray-900">{title}</h1>}
      <form class="mt-6" onSubmit={(e) => onSubmit(e)}>
        {Object.values(reactiveSchema).map((schema) => (
          <div class="mb-2">
            <SchemaToInput key={schema.$id} schema={schema} />
          </div>
        ))}
        <div>
          <button type="submit" class="mt-5 px-5 py-2.5 mr-2 mb-2 text-sm text-white bg-blue-700 rounded-md">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
