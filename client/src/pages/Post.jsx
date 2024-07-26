import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";

function Post() {
  const { slug } = useParams();
  //console.log(slug);
  const [post, setPost] = useState({
    title: "",
    category: "uncategory",
    img: "",
    content: "",
    createAt: "",
    id: "",
  });
  const user = useSelector((state) => state.user.user);
  const [comment, setComment] = useState({
    content: "",
    userId: user._id,
  });
  const [commentList, setCommentList] = useState([]);
  //console.log(comment);
  const maxCommentLength = 200;
  const handleComment = (e) => {
    setComment({ ...comment, content: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      postId: post.id,
      content: comment.content,
      userId: user._id,
    });
    axios
      .post(
        "http://localhost:3001/comment/addcomment",
        {
          postId: post.id,
          content: comment.content,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);

        axios
          .get(`http://localhost:3001/comment/${post.id}`)
          .then((res) => {
            //console.log(res.data);
            setCommentList(res.data);
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));
    setComment({ content: "" });
  };

  useEffect(() => {
    let postId;
    axios
      .get(`http://localhost:3001/post/${slug}`)
      .then((res) => {
        setPost({
          title: res.data.title,
          category: res.data.category,
          img: res.data.img,
          content: res.data.content,
          createAt: res.data.createdAt,
          id: res.data._id,
        });
        axios
          .get(`http://localhost:3001/comment/${res.data._id}`)
          .then((res) => {
            //console.log(res.data);
            setCommentList(res.data);
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));
  }, [slug]);
  console.log(commentList);
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
      <div className="w-full md:w-4/5">
        <div className="flex gap-1 items-center">
          <p>Signed in as: </p>
          <img src={user.avatar} className="w-6 h-6 rounded-full"></img>
          <p className="text-blue-700 ">@{user.username}</p>
        </div>
        <form className="border rounded-lg p-5 mt-4" onSubmit={handleSubmit}>
          <textarea
            className="w-full min-h-20 border rounded-lg p-2 border-blue-600"
            placeholder="Write a comment..."
            value={comment.content}
            onChange={handleComment}
          ></textarea>
          <div className="flex justify-between">
            <p className="my-auto">
              {maxCommentLength - comment.content.length} characters remaining
            </p>
            <button
              className="bg-blue-500 text-white rounded-lg p-2 mt-2 disabled:bg-blue-400"
              type="submit"
              disabled={comment.content === ""}
            >
              Comment
            </button>
          </div>
        </form>
        <p className="mt-4">
          Comments{" "}
          <span className="px-2 py-1 border border-gray-400 rounded-md">
            {commentList.length}
          </span>
        </p>
        {commentList.length != 0 &&
          commentList.map((comment) => {
            return (
              <div className="flex px-6 mt-6 gap-4 " key={comment.id}>
                <img
                  src={comment.user.avatar}
                  className="w-10 h-10 rounded-full"
                ></img>
                <div>
                  <p className="font-semibold">@{comment.user.username}</p>
                  <p>{comment.content}</p>
                  <div className="flex gap-2 text-gray-400">
                    <button className="text-lg">
                      <AiFillLike />
                    </button>
                    <button>{comment.numberOfLikes} Like</button>
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Post;
