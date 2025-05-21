import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Blog",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      type: "image",
      validation: (Rule) => Rule.required(),

      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),

    defineField({
      name: "body",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isSendNotification",
      validation: (Rule) => Rule.required(),

      title:
        "Apakah berita ini akan mengirimkan notifikasi ke aplikasi Tidham?",
      type: "string",
      options: {
        list: [
          { title: "Ya kirim notifikasi", value: "true" },
          { title: "Tidak", value: "false" },
        ],
      },
      initialValue: "false",
    }),
  ],
  preview: {
    select: {
      title: "title",

      media: "mainImage",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
