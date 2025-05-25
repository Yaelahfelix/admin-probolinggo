import { createClient, groq } from "next-sanity";
import { createClient as sanityCreateClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const client = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  useCdn: false,
};

export const sanityClient = sanityCreateClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export const getDocuments = async () => {
  return createClient(client).fetch(
    groq`
            *[_type == "document_public"] {
                title,
                "file": file
            }
        `
  );
};

export const getPartners = async () => {
  return createClient(client).fetch(
    groq`
      *[_type == "partner"] {
        _id,
        "image": image.asset,
        "alt": image.alt
      }
    `
  );
};

export const getStatistics = async () => {
  return createClient(client).fetch(
    groq`
      *[_type == "statistics"]{
        _id,
        id_icon,
        value,
        type_value,
        title
      }
    `
  );
};
