import { Sidebar, TextInput, Select, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function Search() {
  const [searchFilter, setSearchFilter] = useState({
    search: "",
    sort: "latest",
    category: "all",
  });
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  console.log(searchFilter);
  const handleSearchFilterChange = (e) => {
    setSearchFilter({ ...searchFilter, [e.target.name]: e.target.value });
  };

  const handleShowmore = () => {
    const startIdx = posts.length;
    axios
      .get(`http://localhost:3001/post/getposts?startIdx=${startIdx}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.posts.length < 5) setShowMore(false);
        setPosts([...posts, ...res.data.posts]);
      })
      .catch((err) => console.log(err.message));
  };

  const SortCom = () => {
    return (
      <div className="flex gap-3 items-center">
        <p className="font-bold">Sort:</p>
        <Select
          onChange={handleSearchFilterChange}
          value={searchFilter.sort}
          name="sort"
          className="w-full"
        >
          <option value="asc">Latest</option>
          <option value="des">Oldest</option>
        </Select>
      </div>
    );
  };

  const CategoryCom = () => {
    return (
      <div className="flex gap-3 items-center">
        <p className="font-bold">Category:</p>
        <Select
          name="category"
          onChange={handleSearchFilterChange}
          value={searchFilter.category}
          className="w-full"
        >
          <option value="all">All</option>
          <option value="react">React</option>
          <option value="js">Js</option>
        </Select>
      </div>
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(
        `http://localhost:3001/post/getposts?search=${searchFilter.search}&order=${searchFilter.sort}&category=${searchFilter.category}`,
        {}
      )
      .then((res) => {
        console.log(res.data.posts);
        setPosts(res.data.posts);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/post/getposts?limit=5")
      .then((res) => {
        console.log(res.data.posts);
        if (res.data.posts.length < 5) setShowMore(false);
        setPosts(res.data.posts);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <div className="min-h-screen  flex flex-col md:flex-row">
      <Sidebar className="w-full md:w-80">
        <Sidebar.Items className=" md:h-screen">
          <Sidebar.ItemGroup className="gap-3">
            <Sidebar.Item as="div">
              {/* <SearchCom /> */}
              <div className="flex gap-3 items-center">
                <p className="font-bold">Search:</p>
                <TextInput
                  placeholder="Search here..."
                  required
                  name="search"
                  value={searchFilter.search}
                  onChange={(e) => handleSearchFilterChange(e)}
                  className="w-full"
                />
              </div>
            </Sidebar.Item>
            <Sidebar.Item as="div">
              <SortCom />
            </Sidebar.Item>
            <Sidebar.Item as="div">
              <CategoryCom />
            </Sidebar.Item>
            <Sidebar.Item as="div">
              <Button outline className="w-full" onClick={handleSearch}>
                Search
              </Button>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="mt-5 md:w-4/5">
        <h1 className="text-3xl font-bold mt-5 px-5">Post results:</h1>
        {posts.length != 0 ? (
          <div className="flex flex-col items-center md:flex-row flex-wrap gap-8 p-5">
            {posts.length != 0 &&
              posts.map((post) => {
                return (
                  <Link to={`/post/${post.slug}`}>
                    <div
                      key={post._id}
                      className="w-[300px] h-[330px] border rounded-xl group dark:border-gray-800 "
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
        ) : (
          <h1 className="text-2xl font-bold mt-5 px-5">No posts found</h1>
        )}
        {showMore && (
          <Button className="mx-auto w-32 outline" onClick={handleShowmore}>
            Show more
          </Button>
        )}
      </div>
    </div>
  );
}

export default Search;
