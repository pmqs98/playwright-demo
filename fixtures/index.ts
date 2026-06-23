import { test as pageTest } from "./pages";
import { test as apiTest } from "./api";
import { mergeTests } from "@playwright/test";

export const test = mergeTests(pageTest, apiTest);
export { expect } from "@playwright/test";
