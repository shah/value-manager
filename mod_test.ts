import {
  Context,
  ctxFactory,
  isProjectContext,
} from "https://cdn.jsdelivr.net/gh/shah/context-manager@v1.0.1/mod.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@v0.60.0/testing/asserts.ts";
import * as v from "./mod.ts";

const testCtx = ctxFactory.projectContext(".");

Deno.test("Literal and Dynamic Value (variadic)", () => {
  const strValue: string = "textValue";
  const numValue: number = 4;
  const dynValue: v.Value = (ctx: Context, ...extraArgs: any): any => {
    assert(isProjectContext(ctx));
    return "value of test model text property(dynamic)" + extraArgs;
  };

  assert(!v.isDynamicValue(strValue));
  assert(!v.isDynamicValue(numValue));
  assert(v.isDynamicValue(dynValue));

  assertEquals(v.resolveTextValue(testCtx, strValue), "textValue");
  assertEquals(
    v.resolveValue(testCtx, dynValue, "-append"),
    "value of test model text property(dynamic)-append",
  );
});

Deno.test("Literal and Dynamic TextValue", () => {
  const strValue: v.TextValue = "textValue";
  const dynValue: v.TextValue = (ctx: Context, ...extraArgs: any): string => {
    assert(isProjectContext(ctx));
    return "value of test model text property(dynamic)" + extraArgs;
  };

  assert(!v.isDynamicTextValue(strValue));
  assert(v.isDynamicTextValue(dynValue));

  assertEquals(v.resolveTextValue(testCtx, strValue), "textValue");
  assertEquals(
    v.resolveTextValue(testCtx, dynValue, "-append"),
    "value of test model text property(dynamic)-append",
  );
});

Deno.test("Literal and Dynamic NumericValue", () => {
  const numValue: number = 4;
  const dynValue: v.NumericValue = (ctx: Context, extraArg: number): number => {
    assert(isProjectContext(ctx));
    return 5015 + 4 + extraArg;
  };

  assert(!v.isDynamicValue(numValue));
  assert(v.isDynamicValue(dynValue));

  assertEquals(v.resolveNumericValue(testCtx, numValue), 4);
  assertEquals(v.resolveNumericValue(testCtx, dynValue, 4), 5023);
});
