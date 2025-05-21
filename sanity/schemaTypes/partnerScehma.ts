import { Rule } from "sanity";

const partnerSchema = {
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Alternative text for the image, useful for SEO and accessibility.",
          validation: (Rule: Rule) =>
            Rule.required().error("Alt text is required"),
        },
      ],
      validation: (Rule: Rule) => Rule.required().error("Image is required"),
    },
  ],
  preview: {
    select: {
      image: "image",
      title: "image.alt",
    },
    prepare(selection: { image: string; title: string }) {
      const { image, title } = selection;
      return {
        title: title || "No alt text",
        media: image,
      };
    },
  },
};

export default partnerSchema;
