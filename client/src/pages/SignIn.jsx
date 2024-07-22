import { Input } from "postcss";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Navbar, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { error: err } = useSelector((state) => state.user || {});
  console.log(err)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(formData);
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    axios
      .post("http://localhost:3001/signin", formData)
      .then((res) => {
        console.log(res);
        dispatch(signInStart());
        if (res.data.username != null) {
          navigate("/");
          console.log(res.data);
          signInSuccess(res.data);
        } else {
          //console.log(res.data);
          dispatch(signInFailure(res.data));
        }
      })
      .catch((err) => {
        dispatch(signInFailure(err.message));
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
              Sign In
            </Button>
            <OAuth />
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="t">
                Sign Up
              </Link>
            </p>
          </form>
          {err && (
            <Alert color="failure" className="text-center">
              {err}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
