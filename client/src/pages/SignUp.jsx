import { Input } from "postcss";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Navbar, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(formData);
    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please fill all the fields");
    }
    axios
      .post("http://14.225.192.183:8000/signup", formData)
      .then((res) => {
        console.log(res.data);
        if (res.data === "User created successfully") {
          navigate("/signin");
        } else {
          setError(res.data);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex max-w-3xl px-5 mx-auto flex-col md:flex-row ">
        <div className="flex-1 mt-24">
          <Link to="/" className="self-center text-4xl font-bold ">
            <span className="px-2 py-1 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              BaoTN's
            </span>
            Blog
          </Link>
          <p className="mt-5">This is my first blog application</p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <Label value="Username"></Label>
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
              value={formData.username}
              onChange={handleChange}
            ></TextInput>
            <Label value="Email"></Label>
            <TextInput
              type="email"
              placeholder="Email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            ></TextInput>
            <Label value="Password"></Label>
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            ></TextInput>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign Up
            </Button>
            <OAuth></OAuth>
            <p>
              Already have an account?{" "}
              <Link to="/signin" className="t">
                Sign In
              </Link>
            </p>
          </form>
          {error && (
            <Alert color="failure" className="text-center">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
