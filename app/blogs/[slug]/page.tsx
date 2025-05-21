import { generateEmbedUrl, generateToken } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import axios from "axios";
import Image from "next/image";
import React from "react";

type Props = { params: Promise<{ slug: string }> };
const getData = async (id: string) => {
  try {
    const token = generateToken();
    const url = process.env.BASE_URL + "/api/blog/" + id;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    console.log(res.data);
    return res.data.post;
  } catch (err) {
    console.log(err);
  }
};
const BlogsPage = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getData(slug);

  return (
    <div className="p-5 container max-w-3xl mx-auto ">
      <div className="text-xl font-bold ">{post.title}</div>
      <div className="text-sm">{post.description}</div>
      <hr className="my-5" />
      <div className="relative max-w-full m-5 aspect-video mx-auto rounded-lg shadow border border-slate-300">
        <Image src={urlFor(post.mainImage).url()} alt="" fill className="" />
      </div>
      <div className="leading-8">
        <PortableText
          value={post.body}
          components={{
            types: {
              youtube: ({ value }) => {
                const url = value.url;
                console.log(url);
                return (
                  <div className="w-full my-5">
                    <iframe
                      className="w-full aspect-video"
                      src={generateEmbedUrl(url)}
                      title="YouTube video player"
                      frameBorder="0"
                      // allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    {value.caption && <p>{value.caption}</p>}
                  </div>
                );
              },
              image: ({ value }) => {
                return (
                  <div className="m-5 max-w-full aspect-video relative">
                    <Image
                      fill
                      src={urlFor(value).url()}
                      alt={value.alt || "Content Image"}
                      className="rounded-lg "
                    />
                    {value.caption && (
                      <p className="text-center text-sm italic text-slate-600">
                        {value.caption}
                      </p>
                    )}
                  </div>
                );
              },
            },
            block: ({ children }) => (
              <p className="indent-8 mb-4 text-justify">{children}</p>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default BlogsPage;
