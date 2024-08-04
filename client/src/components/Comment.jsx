import { Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdOutlineExpandMore } from "react-icons/md";

function Comment() {
  const [comments, setComments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [commentDeleteId, setCommentDeleteId] = useState("");
  const shorten = (str, len = 15) => {
    return str.length > len ? str.substring(0, len) + "..." : str;
  };

  const [showMore, setShowMore] = useState(true);
  console.log(showMore);
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
        setComments(comments.filter((comment) => comment._id !== commentId));
      })
      .catch((err) => console.log(err));
  };
  const handleShowmore = () => {
    const startIdx = comments.length;
    axios
      .get(
        `http://14.225.192.183:8000/comment/getcomments?start=${startIdx}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length < 5) setShowMore(false);
        setComments([...comments, ...res.data]);
      })
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    axios
      .get("http://14.225.192.183:8000/comment/getcomments?limit=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setComments(res.data);
        console.log(res.data);
        if (res.data.length < 5) {
          setShowMore(false);
        }
        //console.log(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className=" max-w-2xl lg:max-w-max table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-lg">
        <Table.Head className="text-center">
          <Table.HeadCell>Date updated</Table.HeadCell>
          <Table.HeadCell>User</Table.HeadCell>
          <Table.HeadCell>Comment</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {comments.length != 0 &&
            comments.map((comment) => {
              return (
                <Table.Row key={comment._id}>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <img
                        src={comment.user.avatar}
                        className="w-8 h-8 rounded-full"
                        alt="avatar"
                      ></img>
                      <p className="font-bold flex items-center">
                        {shorten(comment.user.username)}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{shorten(comment.content, 45)}</Table.Cell>
                  <Table.Cell>
                    <button
                      className="text-red-600 dark:text-red-500"
                      onClick={() => {
                        setOpenModal(true);
                        setCommentDeleteId(comment._id);
                      }}
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
      {showMore && (
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

export default Comment;
