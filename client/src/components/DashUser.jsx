import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdOutlineExpandMore } from "react-icons/md";

function DashUser() {
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const shorten = (str) => {
    return str.length > 15 ? str.substring(0, 15) + "..." : str;
  };
  const handleDelete = () => {
    axios
      .delete(`http://14.225.192.183/api/user/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUsers(users.filter((u) => u._id !== deleteId));
      })
      .catch((err) => console.log(err.message));
    setOpenModal(false);
  };

  useEffect(() => {
    axios
      .get("http://14.225.192.183/api/user/getusers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        //console.log(res.data)
        setUsers(res.data);
        if (res.data.length < 5) setShowMore(false);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const handleShowmore = () => {
    const startIdx = users.length;
    axios
      .get(
        `http://14.225.192.183/api/user/getusers?startIdx=${startIdx}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length < 5) setShowMore(false);
        setUsers([...users, ...res.data]);
      })
      .catch((err) => console.log(err.message));
  };
  //console.log(users);
  return (
    <div className="max-w-2xl lg:max-w-max table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-lg">
        <Table.Head className="text-center">
          <Table.HeadCell>Date create</Table.HeadCell>
          <Table.HeadCell>User</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Admin</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {users.map((user) => {
            return (
              <Table.Row key={user._id}>
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex">
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <p className="font-bold flex items-center">
                      {user.username}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>{shorten(user.email)}</Table.Cell>
                <Table.Cell>
                  {user.isAdmin ? (
                    <p className="font-bold text-green-600 dark:text-green-300">
                      Admin
                    </p>
                  ) : (
                    "User"
                  )}
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="text-red-700"
                    onClick={() => {
                      setOpenModal(true);
                      setDeleteId(user._id);
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete()}>
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

export default DashUser;
