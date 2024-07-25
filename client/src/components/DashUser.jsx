import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "flowbite-react";

function DashUser() {
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const shorten = (str) => {
    return str.length > 15 ? str.substring(0, 15) + "..." : str;
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/user/getusers", {
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
      .get(`http://localhost:3001/user/getusers?startIdx=${startIdx}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.length < 5) setShowMore(false);
        setUsers([...users, ...res.data]);
      })
      .catch((err) => console.log(err.message));
  };
  //console.log(users);
  return (
    <div className="max-w-2xl lg:max-w-max table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-md">
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
                <Table.Cell>{user.isAdmin ? "Admin" : "User"}</Table.Cell>
                <Table.Cell>
                  <button
                    className="text-red-700"
                    onClick={() => {
                      axios
                        .delete(
                          `http://localhost:3001/user/delete/${user._id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        )
                        .then((res) => {
                          console.log(res.data);
                          setUsers(users.filter((u) => u._id !== user._id));
                        })
                        .catch((err) => console.log(err.message));
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
        <Button outline className="w-full" onClick={handleShowmore}>
          Show more
        </Button>
      )}
    </div>
  );
}

export default DashUser;
