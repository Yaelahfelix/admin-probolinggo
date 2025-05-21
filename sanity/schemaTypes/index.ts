import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
// import { categoryType } from "./categoryType";
import { appConfigType } from "./appConfigType";
import { informationType } from "./information";
import statisticSchema from "./statisticSchema";
import blogSchema from "./blogSchema";
import documentSchema from "./documentSchema";
import partnerSchema from "./partnerScehma";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    // postType,
    appConfigType,
    informationType,
    statisticSchema,
    blogSchema,
    documentSchema,
    partnerSchema,
  ],
};
