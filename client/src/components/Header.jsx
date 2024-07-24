import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import axios from "axios";
import { signOut } from "../redux/user/userSlice";  

function Header() {
  const path = useLocation().pathname;
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //console.log(user);
  const theme = useSelector((state) => state.theme.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSignOut = () => {
    axios.get("http://localhost:3001/user/signout").then((res) => {
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
      <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        ></TextInput>
      </form>
      <Button className="lg:hidden h-10" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className="h-10" color="gray" pill onClick={handleToggleTheme}>
          {theme == "dark" ? <FaMoon /> : <FaSun />}
        </Button>
        {user ? (
          <Dropdown
            inline
            arrowIcon={false}
            label={<Avatar alt="user" img={user&&user.avatar} rounded></Avatar>}
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
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
