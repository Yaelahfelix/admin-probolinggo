export interface WebHomepage {
  name: string;
  value: YoutubeURL | WhatsappAdmin[];
  createdAt: Date;
  updatedAt: Date;
}

export interface YoutubeURLType {
  name: string;
  value: YoutubeURL;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentHomepageType {
  name: string;
  value: DocumentURL;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentURL = {
  url: string;
};

export interface WhatsappAdminType {
  name: string;
  value: WhatsappAdmin[];
  createdAt: Date;
  updatedAt: Date;
}

export type YoutubeURL = {
  url: string;
};

export type WhatsappAdmin = {
  nama: string;
  number: string;
};
