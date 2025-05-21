"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\blog\[[...tool]]\page.tsx` route
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./sanity/schemaTypes";

export const sanityConfig = defineConfig({
  name: "pdam_probolinggo",
  dataset: "production",
  projectId: "v05rmwlb",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: schema,
});
