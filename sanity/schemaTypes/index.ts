import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
// import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { appConfigType } from "./appConfigType";
import { informationType } from "./information";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, postType, appConfigType, informationType],
};
