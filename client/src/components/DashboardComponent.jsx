import { FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowUp, FaComments } from "react-icons/fa";
import { BsFileEarmarkPost } from "react-icons/bs";

function DashboardComponent() {
  const [userMetrics, setUserMetrics] = useState({});
  const [commentMetrics, setCommentMetrics] = useState({});
  const [postMetrics, setPostMetrics] = useState({});

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentComments, setRecentComments] = useState([]);

  const shorten = (str, len = 15) => {
    return str.length > len ? str.substring(0, len) + "..." : str;
  };

  useEffect(() => {
    //fetch data
    axios
      .get("http://14.225.192.183:8000/user/get-metrics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUserMetrics({
          total: res.data.totalUsers,
          lastMonth: res.data.totalUsersLastMonth,
        });
        console.log(res.data);
      })
      .catch((err) => console.log(err.message));

    axios
      .get("http://14.225.192.183:8000/comment/get-metrics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCommentMetrics({
          total: res.data.totalComments,
          lastMonth: res.data.totalCommentsLastMonth,
        });
        console.log(res.data);
      })
      .catch((err) => console.log(err.message));

    axios
      .get("http://14.225.192.183:8000/post/get-metrics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPostMetrics({
          total: res.data.totalPosts,
          lastMonth: res.data.totalPostsLastMonth,
        });
        console.log(res.data);
      })
      .catch((err) => console.log(err.message));

    axios
      .get("http://14.225.192.183:8000/user/getusers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setRecentUsers(res.data);
      })
      .catch((err) => console.log(err.message));

    axios
      .get("http://14.225.192.183:8000/comment/getcomments")
      .then((res) => {
        console.log(res.data);
        setRecentComments(res.data);
      })
      .catch((err) => console.log(err.message));
  }, []);
  return (
    <div className="max-w-2xl lg:max-w-max table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="w-full sm:w-60 p-4  border rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">TOTAL USER</p>
              <p className="text-xl font-bold">{userMetrics.total}</p>
            </div>
            <FaUsers className="text-5xl text-white bg-cyan-600 rounded-full p-2" />
          </div>
          <p className="mt-5">
            <span className="text-green-500 mr-1">
              <FaArrowUp className="inline-block pb-1" />
              {userMetrics.lastMonth}
            </span>
            Last month
          </p>
        </div>
        <div className="w-full sm:w-60 p-4  border rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">TOTAL COMMENT</p>
              <p className="text-xl font-bold">{commentMetrics.total}</p>
            </div>
            <FaComments className="text-5xl text-white bg-lime-600 rounded-full p-2" />
          </div>
          <p className="mt-5">
            {" "}
            <span className="text-green-500 mr-1">
              <FaArrowUp className="inline-block pb-1" />
              {commentMetrics.lastMonth}
            </span>
            Last month
          </p>
        </div>
        <div className="w-full sm:w-60 p-4  border rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">TOTAL POSTS</p>
              <p className="text-xl font-bold">{postMetrics.total}</p>
            </div>
            <BsFileEarmarkPost className="text-5xl text-white bg-sky-400 rounded-full p-2" />
          </div>
          <p className="mt-5">
            {" "}
            <span className="text-green-500 mr-1">
              <FaArrowUp className="inline-block pb-1" />
              {postMetrics.lastMonth}
            </span>
            Last month
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
        <div className="border rounded-md w-full shadow-sm p-4 md:w-60">
          <h1 className="font-semibold text-xl">Recent Users</h1>
          <div className="flex flex-col gap-4 mt-4">
            {recentUsers.map((user) => (
              <div className="flex gap-2" key={user._id}>
                <img src={user.avatar} className="w-12 h-12 rounded-full"></img>
                <div className="ml-4">
                  <p className="font-semibold">{shorten(user.username)}</p>
                  <p>{shorten(user.email)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-md shadow-sm p-4 w-96">
          <h1 className="font-semibold text-xl">Recent Comments</h1>
          <div className="flex flex-col gap-3 mt-4">
            {recentComments.length != 0 &&
              recentComments.map((comment) => (
                <div className="flex gap-2" key={comment._id}>
                  <div className="flex-1">{shorten(comment.content, 35)}</div>
                  <div className="">{comment.likes.length} likes</div>
                </div>
              ))}
          </div>
          {/* <div className="flex gap-2">
            <div className="flex-1">Nice br</div>
            <div className="">1 likes</div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">Nice br</div>
            <div className="">1 likes</div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
