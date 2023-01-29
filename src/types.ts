import { Signal } from "@preact/signals";
import { TBoolean, TNumber, TSchema, TString } from "@sinclair/typebox";

export type SchemaValue = string | number | string[];

export type FormSchema<T extends TSchema = TSchema> = T & {
  $id: string;
  error: Signal<string>;
} & (T extends TBoolean ? { value: Signal<boolean> } : { value: Signal<string | number> });

export type FPrimitive = FormSchema<TString | TNumber | TBoolean>;

export type FSchema = FPrimitive | FObject;

export interface FObject<T = FSchema | undefined> {
  [name: string]: T;
}
