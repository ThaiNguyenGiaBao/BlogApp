import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiUser } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { BsFileEarmarkPost } from "react-icons/bs";
import { useSelector } from "react-redux";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUser from "../components/DashUser";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const user = useSelector((state) => state.user.user);
  //console.log(user);

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const Searchtab = search.get("tab");
    if (Searchtab) {
      setTab(Searchtab);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-2 ">
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                as="div"
                label={user.isAdmin ? "Admin" : "User"}
                labelColor={user.isAdmin ? "red" : "green"}
              >
                Profile
              </Sidebar.Item>
            </Link>
            {user.isAdmin && (
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={BsFileEarmarkPost}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
            )}
            {user.isAdmin && (
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={FaUserFriends}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
            )}
            <Link to="/dashboard?tab=settings">
              <Sidebar.Item
                active={tab === "settings"}
                icon={CiSettings}
                as="div"
              >
                Settings
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPost />}
      {tab === "users" && <DashUser />}
    </div>
  );
}

export default Dashboard;
