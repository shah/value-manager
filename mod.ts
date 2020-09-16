import type { Context } from "https://denopkg.com/shah/context-manager@v1.0.6/mod.ts";
import type * as inflect from "https://denopkg.com/shah/text-inflect@v1.0.4/mod.ts";
export { snakeCaseValue as name } from "https://denopkg.com/shah/text-inflect@v1.0.4/mod.ts";

export interface FutureInterpolatableValue {
  readonly isFutureInterpolatableValue: true;
  readonly name: inflect.InflectableValue;
  prepare(ctx: Context, ...args: unknown[]): string;
}

export function isFutureInterpolatableValue(
  v: unknown,
): v is FutureInterpolatableValue {
  return (v && typeof v === "object" && "isFutureInterpolatableValue" in v);
}

export interface DynamicValue {
  (ctx: Context, ...args: unknown[]): unknown;
}

export type Value = DynamicValue | FutureInterpolatableValue | unknown;

export function resolveValue(
  ctx: Context,
  value: Value,
  ...args: unknown[]
): unknown {
  if (isDynamicValue(value)) return value(ctx, ...args);
  if (isFutureInterpolatableValue(value)) return value.prepare(ctx, ...args);
  return value;
}

export function isDynamicValue(v: unknown): v is DynamicValue {
  return (typeof v === "function");
}

export interface DynamicTextValue {
  (ctx: Context, ...args: unknown[]): string;
}

export type TextValue = string | FutureInterpolatableValue | DynamicTextValue;

export function resolveTextValue(
  ctx: Context,
  value: TextValue,
  ...args: unknown[]
): string {
  if (typeof value === "string") return value;
  if (isDynamicTextValue(value)) return value(ctx, ...args);
  return value.prepare(ctx, ...args);
}

export function isDynamicTextValue(v: unknown): v is DynamicTextValue {
  return (typeof v === "function");
}

export interface DynamicNumericValue {
  (ctx: Context, ...args: unknown[]): number;
}

export type NumericValue =
  | number
  | FutureInterpolatableValue
  | DynamicNumericValue;

export function resolveNumericValue(
  ctx: Context,
  value: NumericValue,
  ...args: unknown[]
): number | FutureInterpolatableValue {
  if (typeof value === "number") return value;
  if (isDynamicNumericValue(value)) return value(ctx, ...args);
  return value;
}

export function resolveNumericValueAsText(
  ctx: Context,
  value: NumericValue,
  ...args: unknown[]
): string {
  if (typeof value === "number") return value.toString();
  if (isDynamicNumericValue(value)) return value(ctx, ...args).toString();
  return value.prepare(ctx, ...args);
}

export function isDynamicNumericValue(v: unknown): v is DynamicNumericValue {
  return (v && typeof v === "function");
}
