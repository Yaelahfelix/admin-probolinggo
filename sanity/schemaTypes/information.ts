import { InfoOutlineIcon } from "@sanity/icons";
import { defineType } from "sanity";

export const informationType = defineType({
  name: "information",
  type: "document",
  title: "Information",
  icon: InfoOutlineIcon,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      type: "text",
      title: "Description",
    },
    {
      name: "image",
      type: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "created_at",
      type: "datetime",
      title: "Created At",
      initialValue: () => new Date().toISOString(),
      hidden: true,
    },
    {
      name: "expired_at",
      type: "datetime",
      title: "Expired At",
      readOnly: true,
      initialValue: () => {
        const now = new Date();
        now.setDate(now.getDate() + 3);
        return now.toISOString();
      },
    },
  ],
});
