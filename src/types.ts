import { Signal } from "@preact/signals";
import { TNumber, TString } from "@sinclair/typebox";

export type SchemaValue = string | number | string[];

export type FormGroupValue = Record<string, SchemaValue>;

export interface FNumber extends TNumber {
  $id: string;
  value: Signal<number>;
  error: Signal<string>;
}

export interface FString extends TString {
  $id: string;
  value: Signal<string>;
  error: Signal<string>;
}

export type FPrimitive = FString | FNumber;

export type FSchema = FPrimitive | FObject;

export interface FObject<T = FSchema | undefined> {
  [name: string]: T;
}
