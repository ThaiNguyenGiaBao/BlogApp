import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Post() {
  const { slug } = useParams();
  //console.log(slug);
  const [post, setPost] = useState({
    title: "",
    category: "uncategory",
    img: "",
    content: "",
    createAt: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3001/post/${slug}`)
      .then((res) => {
        //console.log(res.data);
        setPost({
          title: res.data.title,
          category: res.data.category,
          img: res.data.img,
          content: res.data.content,
          createAt: res.data.createdAt,
        });
      })
      .catch((err) => console.log(err.message));
  }, [slug]);
  //console.log(post);
  return (
    <div className="flex w-4/5 md:w-3/4 flex-col items-center mx-auto">
      <h1 className="font-semibold text-4xl mt-10 ">{post.title}</h1>
      <span className="mt-5 border rounded-full px-3 py-1">
        {post.category}
      </span>
      <img
        src={post.img}
        className="w-full max-h-[300px] md:max-h-[500px] object-cover mt-5"
        alt="Post"
      ></img>
      <div className="flex justify-between w-full border-b-2 m-2">
        <p className="font-semibold">Thai Nguyen Gia Bao</p>
        <p>{new Date(post.createAt).toLocaleDateString()}</p>
      </div>
      <div>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="post-content"
        />
      </div>
    </div>
  );
}

export default Post;
