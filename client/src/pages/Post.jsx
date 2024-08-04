import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
import { Alert, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

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
    //userId: user._id,
  });
  const [commentDeleteId, setCommentDeleteId] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [recentArticles, setRecentArticles] = useState([]);
  const [error, setError] = useState(null);
  const maxCommentLength = 200;
  const handleComment = (e) => {
    setComment({ ...comment, content: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user == null) {
      setError("Please sign in to comment");
      return;
    }
    if (user == null) {
    }
    console.log({
      postId: post.id,
      content: comment.content,
      userId: user._id,
    });
    axios
      .post(
        "http://14.225.192.183:8000/comment/addcomment",
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
          .get(`http://14.225.192.183:8000/comment/${post.id}`)
          .then((res) => {
            //console.log(res.data);
            setCommentList(res.data);
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));
    setComment({ content: "" });
  };

  const handleLike = (idx, commentId) => {
    if (user == null) {
      return;
    }
    //console.log(idx, commentId);
    const comment = commentList[idx];
    //console.log(comment.likes.includes(user._id));
    if (comment.likes.includes(user?._id)) {
      // User already liked, remove their like
      comment.likes = comment.likes.filter((id) => id !== user?._id);
    } else {
      // User hasn't liked yet, add their like
      comment.likes = [...comment.likes, user?._id];
    }
    console.log(comment);
    const updatedCommentList = [...commentList];
    updatedCommentList[idx] = comment;
    setCommentList(updatedCommentList);

    axios
      .put(
        `http://14.225.192.183:8000/comment/update-likes/${commentId}`,
        comment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err.message));
  };
  const handleDelete = (commentId) => {
    console.log(commentId);
    axios
      .delete(`http://14.225.192.183:8000/comment/delete/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCommentList(
          commentList.filter((comment) => comment._id !== commentId)
        );
      })
      .catch((err) => console.log(err));
  };

  // Write a function to display the difference between the current time and the time the post was created (second, minute, hour, day, week, month, year)
  const calcTime = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const seconds = Math.floor((currentDate - postDate) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };
  const shorten = (str, len = 35) => {
    return str.length > len ? str.substring(0, len) + "..." : str;
  };
  useEffect(() => {
    axios
      .get(`http://14.225.192.183:8000/post/${slug}`)
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
          .get(`http://14.225.192.183:8000/comment/${res.data._id}`)
          .then((res) => {
            //console.log(res.data);
            setCommentList(res.data);
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));

    // Get recent articles
    axios
      .get("http://14.225.192.183:8000/post/getposts?limit=3")
      .then((res) => {
        setRecentArticles(res.data.posts);
      })
      .catch((err) => console.log(err.message));
  }, [slug]);
  //console.log(commentList);
  console.log(recentArticles);
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
        {user ? (
          <div className="flex gap-1 items-center">
            <p>Signed in as: </p>
            <img src={user.avatar} className="w-6 h-6 rounded-full"></img>
            <p className="text-blue-700 dark:text-blue-500">@{user.username}</p>
          </div>
        ) : (
          <p>Sign in to comment</p>
        )}

        <form
          className="border dark:border-gray-700 rounded-lg p-5 mt-4"
          onSubmit={handleSubmit}
        >
          <textarea
            className="w-full min-h-20 border dark:bg-gray-700 rounded-lg p-2 border-blue-600"
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
        {error && (
          <Alert color="red" className="mt-4">
            {error}
          </Alert>
        )}
        <p className="mt-4">
          Comments{" "}
          <span className="px-2 py-1 border border-gray-400 rounded-md">
            {commentList.length}
          </span>
        </p>
        {commentList.length != 0 &&
          commentList.map((comment, idx) => {
            //console.log(comment.likes);
            return (
              <div className="flex px-6 mt-6 gap-4 " key={comment._id}>
                <img
                  src={comment.user.avatar}
                  className="w-10 h-10 rounded-full"
                ></img>
                <div>
                  <div className="flex gap-3">
                    <p className="font-semibold">@{comment.user.username}</p>
                    <p className="text-gray-500">
                      {calcTime(comment.createdAt)}
                    </p>
                  </div>
                  <p>{comment.content}</p>
                  <div className="flex gap-2 text-gray-400">
                    <button
                      //className="hover:text-blue-600 text-lg"
                      className={
                        comment.likes.includes(user?._id)
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                      onClick={() => handleLike(idx, comment._id)}
                    >
                      <AiFillLike />
                    </button>
                    <button>{comment.likes.length} Like</button>
                    {user?._id === comment.userId && <button>Edit</button>}
                    {(user?._id === comment.userId || user?.isAdmin) && (
                      <button
                        className="text-red-600 dark:text-red-500"
                        onClick={() => {
                          setOpenModal(true);
                          setCommentDeleteId(comment._id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="mt-10 w-full">
        <p className="text-xl font-semibold text-center mb-3">
          Recent articles
        </p>
        <div className="flex flex-col items-center md:justify-center md:flex-row gap-8 flex-wrap">
          {recentArticles.length != 0 &&
            recentArticles.map((post) => {
              return (
                <Link to={`/post/${post.slug}`}>
                  <div
                    key={post._id}
                    className="w-[300px] h-[330px] border border-gray-300 dark:border-gray-700 rounded-xl group "
                  >
                    <img
                      src={post.img}
                      className="w-full rounded-t-lg h-[260px] object-cover group-hover:h-[200px] transition-all duration-300 z-20"
                    ></img>
                    <div className="px-3 my-3">
                      <p className="font-semibold ">
                        {shorten(post.title, 35)}
                      </p>
                      <p className="text-gray-500">{post.category}</p>
                    </div>
                    <button className="hidden group-hover:block w-3/4 text-center border border-green-500 m-auto p-2 rounded-lg hover:bg-green-500">
                      Read post
                    </button>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  handleDelete(commentDeleteId);
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Post;
