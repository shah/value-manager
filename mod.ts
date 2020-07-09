import { Context } from "https://cdn.jsdelivr.net/gh/shah/context-manager@v1.0.1/mod.ts";
import * as inflect from "https://cdn.jsdelivr.net/gh/shah/text-inflect@v1.0.0/mod.ts";
export { snakeCaseValue as name } from "https://cdn.jsdelivr.net/gh/shah/text-inflect@v1.0.0/mod.ts";

export interface FutureInterpolatableValue {
  readonly isFutureInterpolatableValue: true;
  readonly name: inflect.InflectableValue;
  prepare(ctx: Context, ...args: any): string;
}

export function isFutureInterpolatableValue(
  v: any,
): v is FutureInterpolatableValue {
  return (typeof v === "object" && "isFutureInterpolatableValue" in v);
}

export interface DynamicValue {
  (ctx: Context, ...args: any): any;
}

export type Value = DynamicValue | FutureInterpolatableValue | any;

export function resolveValue(
  ctx: Context,
  value: Value,
  ...args: any
): any {
  if (isDynamicValue(value)) return value(ctx, ...args);
  if (isFutureInterpolatableValue(value)) return value.prepare(ctx, ...args);
  return value;
}

export function isDynamicValue(v: any): v is DynamicValue {
  return (typeof v === "function");
}

export interface DynamicTextValue {
  (ctx: Context, ...args: any): string;
}

export type TextValue = string | FutureInterpolatableValue | DynamicTextValue;

export function resolveTextValue(
  ctx: Context,
  value: TextValue,
  ...args: any
): string {
  if (typeof value === "string") return value;
  if (isDynamicTextValue(value)) return value(ctx, ...args);
  return value.prepare(ctx, ...args);
}

export function isDynamicTextValue(v: any): v is DynamicTextValue {
  return (typeof v === "function");
}

export interface DynamicNumericValue {
  (ctx: Context, ...args: any): number;
}

export type NumericValue =
  | number
  | FutureInterpolatableValue
  | DynamicNumericValue;

export function resolveNumericValue(
  ctx: Context,
  value: NumericValue,
  ...args: any
): number | FutureInterpolatableValue {
  if (typeof value === "number") return value;
  if (isDynamicNumericValue(value)) return value(ctx, ...args);
  return value;
}

export function resolveNumericValueAsText(
  ctx: Context,
  value: NumericValue,
  ...args: any
): string {
  if (typeof value === "number") return value.toString();
  if (isDynamicNumericValue(value)) return value(ctx, ...args).toString();
  return value.prepare(ctx, ...args);
}

export function isDynamicNumericValue(v: any): v is DynamicNumericValue {
  return (typeof v === "function");
}
