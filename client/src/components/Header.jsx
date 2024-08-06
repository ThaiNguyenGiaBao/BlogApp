import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import axios from "axios";
import { signOut } from "../redux/user/userSlice";
import { useState } from "react";

function Header() {
  const path = useLocation().pathname;
  const { user } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSearch = () => {
    //console.log(search);
    window.location.href = `/search?search=${search}`;
  };

  const handleSignOut = () => {
    axios.get("http://14.225.192.183/api/user/signout").then((res) => {
      console.log(res.data);
      // Remove token in local storage
      localStorage.removeItem("token");
      dispatch(signOut());
      window.location.href = "/signin";
    });
  };

  return (
    <Navbar className="border-b-2 ">
      <Link to="/" className="self-center text-sm sm:text-xl font-bold ">
        <span className="px-2 py-1 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          BaoTN's
        </span>
        Blog
      </Link>

      <Link to="/search">
        <AiOutlineSearch
          className="text-4xl hover:cursor-pointer border dark:border-gray-500 rounded-full py-1 w-12"
          color="gray"
        />
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button className="h-10" color="gray" pill onClick={handleToggleTheme}>
          {theme == "dark" ? <FaMoon /> : <FaSun />}
        </Button>
        {user ? (
          <Dropdown
            inline
            arrowIcon={false}
            label={
              <Avatar alt="user" img={user && user.avatar} rounded></Avatar>
            }
          >
            <Dropdown.Header className="font-semibold">
              {user.username}
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/signin"}>
            <Button className="h-10" color="gray" pill>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Link to="/">
          <Navbar.Link active={path === "/"} as={"div"}>
            Home
          </Navbar.Link>
        </Link>
        <Link to="/projects">
          <Navbar.Link active={path === "/projects"} as={"div"}>
            Projects
          </Navbar.Link>
        </Link>
        <Link to="/about">
          <Navbar.Link active={path === "/about"} as={"div"}>
            About me
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
