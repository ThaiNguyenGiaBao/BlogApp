import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://14.225.192.183:8000/post/getposts?limit=4")
      .then((res) => {
        console.log(res.data);
        setPosts(res.data.posts);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <div className="min-h-screen w-4/5 md:w-3/4 mx-auto">
      <h1 className="mt-10 text-4xl font-bold">Welcome to my Blog</h1>
      <p>You can find somethings interesting here</p>

      <p className="text-3xl font-bold text-center my-4">Posts</p>
      <div className="flex flex-col items-center md:justify-center md:flex-row gap-8 flex-wrap">
        {posts.length != 0 &&
          posts.map((post) => {
            return (
              <Link to={`/post/${post.slug}`}>
                <div
                  key={post._id}
                  className="w-[300px] h-[330px] border rounded-xl group "
                >
                  <img
                    src={post.img}
                    className="w-full rounded-t-lg h-[260px] object-cover group-hover:h-[200px] transition-all duration-300 z-20"
                  ></img>
                  <div className="px-3 my-3">
                    <p className="font-semibold ">{post.title}</p>
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
  );
}

export default Home;
