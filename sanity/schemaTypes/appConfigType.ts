import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const appConfigType = defineType({
  name: "appConfig",
  title: "App Configuration",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "appVersion",
      title: "App Version",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "Masukkan updated versi aplikasi (cnth: 2.1.0). PENJELASAN: Ada 3 struktur (versi x.y.z), kalau x artinya HARUS DI UPDATE, kalau y artinya LEBIH BAIK DI UPDATE, kalo z artinya BOLEH DI UPDATE BOLEH KAGA",
    }),
    defineField({
      name: "whatsappNumber",
      title: "Nomor Whatsapp",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Masukkan nomor admin whatsapp (cnth: 0812345678)",
    }),
  ],
  preview: {
    select: {
      title: "appVersion",
      subtitle: "whatsappNumber",
    },
    prepare(selection) {
      return {
        title: `App Version: ${selection.title}`,
        subtitle: `WhatsApp: ${selection.subtitle}`,
      };
    },
  },
});
