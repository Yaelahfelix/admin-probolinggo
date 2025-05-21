// schemas/document.js
const documentSchema = {
  name: "document_public",
  type: "document",
  title: "Document",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "file",
      type: "file",
      title: "File",
      options: {
        accept: ".pdf,.doc,.docx,.txt,.xls,.xlsx",
      },
    },
  ],
};

export default documentSchema;
