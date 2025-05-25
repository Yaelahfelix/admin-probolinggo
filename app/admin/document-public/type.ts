export type PublicDocument = {
  _id: string;
  title: string;
  file: {
    _id: string;
    url: string;
    type: string;
  };
};
