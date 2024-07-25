import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

function DashPost() {
  const user = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState("");
  const [showmore, setShowmore] = useState(true);
  const handleShowmore = () => {
    const startIdx = posts.length;
    axios
      .get(`http://localhost:3001/post/getposts?startIdx=${startIdx}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.posts.length < 5) setShowmore(false);
        setPosts([...posts, ...res.data.posts]);
      })
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:3001/post/getposts?limit=5", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setPosts(res.data.posts);
          if (res.data.posts.length < 5) setShowmore(false);
          //console.log(res.data);
        })
        .catch((err) => console.log(err.message));
    };
    if (user.isAdmin) {
      fetchData();
    }
  }, []);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto scrollbar m-5 scrollbar-track-slate-100 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-500">
      {posts.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {posts.map((post) => (
                <Table.Row>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <Table.Cell>
                      <img
                        src={post.img}
                        className="w-20 h-10 object-cover"
                        alt="post"
                      />
                    </Table.Cell>
                  </Link>
                  <Table.Cell className="font-bold">{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <Button color="red">Delete</Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button>Edit</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showmore && (
            <Button
              className="w-full self-center"
              onClick={handleShowmore}
              outline
            >
              Show more
            </Button>
          )}{" "}
        </div>
      ) : (
        <h1>You don't have any post</h1>
      )}
    </div>
  );
}

export default DashPost;
