import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdOutlineExpandMore } from "react-icons/md";

function DashPost() {
  const user = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState("");
  const [showmore, setShowmore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const handleShowmore = () => {
    const startIdx = posts.length;
    axios
      .get(
        `http://14.225.192.183:8000/post/getposts?startIdx=${startIdx}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.posts.length < 5) setShowmore(false);
        setPosts([...posts, ...res.data.posts]);
      })
      .catch((err) => console.log(err.message));
  };
  const handleDelete = (id) => {
    axios
      .delete(`http://14.225.192.183:8000/post/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPosts(posts.filter((post) => post._id !== id));
      })
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://14.225.192.183:8000/post/getposts?limit=5", {
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
    <div className="max-w-2xl lg:max-w-max table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {posts.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head className="text-center">
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {posts.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.img}
                        className="w-20 h-10 object-cover"
                        alt="post"
                      />
                    </Link>
                  </Table.Cell>

                  <Table.Cell className="font-bold">{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="red"
                      onClick={() => {
                        console.log(post._id);
                        setDeleteId(post._id);
                        setOpenModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Cell>

                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <Button>Edit</Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showmore && (
            <div>
              <MdOutlineExpandMore
                onClick={handleShowmore}
                className="mx-auto hover:cursor-pointer h-10 w-10 text-gray-400 dark:text-gray-200"
              />
            </div>
          )}
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
                  Are you sure you want to delete this post?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => {
                      handleDelete(deleteId);
                      setDeleteId("");
                      setOpenModal(false);
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

          {user.isAdmin && (
            <Button
              onClick={() => {
                window.location.href = "/create-post";
              }}
              className="w-3/4 mt-4 mx-auto"
            >
              Create Post
            </Button>
          )}
        </div>
      ) : (
        <h1>You don't have any post</h1>
      )}
    </div>
  );
}

export default DashPost;
