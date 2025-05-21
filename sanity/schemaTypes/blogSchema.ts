import { DocumentIcon } from "@sanity/icons";
import { Rule } from "sanity";

const blogSchema = {
  name: "blog",
  title: "Blog",
  icon: DocumentIcon,
  type: "document",
  fields: [
    {
      name: "name",
      title: "Judul",
      validation: (Rule: Rule) => Rule.required(),
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule: Rule) => Rule.required(),
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "description",
      title: "Deskripsi",
      validation: (Rule: Rule) => Rule.required(),
      type: "string",
    },
    {
      name: "image",
      title: "Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
      fields: [
        {
          name: "alt",
          title: "Alternative Text",
          type: "string",
        },
      ],
    },
    {
      name: "author",
      title: "Penulis",
      type: "string",
    },
    {
      name: "content",
      title: "Isi Konten",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Deskripsi gambar untuk aksesibilitas dan SEO",
              validation: (rule: Rule) =>
                rule.required().error("Alt text is required"),
            },
          ],
        },
        {
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            {
              name: "url",
              type: "url",
              title: "YouTube URL",
              description: "Masukkan URL video YouTube",
              validation: (rule: Rule) =>
                rule
                  .uri({
                    scheme: ["http", "https"],
                    allowRelative: false,
                  })
                  .required()
                  .error("URL YouTube harus diisi dan valid"),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Deskripsi singkat untuk video (opsional)",
            },
          ],
        },
      ],
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "image",
    },
    prepare(value: Record<string, object>) {
      const { title, subtitle, media, author } = value;
      return {
        title,
        subtitle: `${subtitle} - by ${author || "Unknown Author"}`,
        media,
      };
    },
  },
};

export default blogSchema;
