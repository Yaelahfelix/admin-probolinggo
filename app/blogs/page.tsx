import { generateToken } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const getData = async () => {
  const token = generateToken();
  const res = await axios.get(process.env.BASE_URL + "/api/blog", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

async function BlogPage() {
  // const data = await getData();
  // const blogComp = [];

  // for (let i = 0; i < data.posts.length; i++) {
  //   const post = data.posts[i];
  //   console.log(post.mainImage);
  //   blogComp.push(
  //     <Link
  //       href={"/blogs/" + post.slug}
  //       key={i}
  //       className="w-full border border-gray-300 rounded-lg shadow hover:scale-105 transition-transform cursor-pointer"
  //     >
  //       <div className="relative w-full aspect-video">
  //         <Image src={post.mainImage} alt="" fill />
  //       </div>
  //       <div className="p-5 border-t">
  //         <h3 className="text-xl font-bold">{post.title}</h3>
  //         <p>{post.description}</p>
  //       </div>
  //     </Link>
  //   );
  // }

  return (
    <section>
      {/* <div>
        <h1 className="text-center font-bold text-3xl">Berita</h1>
        <hr />
      </div>
      <div className="grid grid-cols-4 p-10">{blogComp}</div> */}
      <p>In Development</p>
    </section>
  );
}

export default BlogPage;
