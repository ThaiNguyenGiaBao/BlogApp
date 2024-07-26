import { Button } from "flowbite-react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/user/userSlice";

function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOAuth = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      //console.log(result);
      axios
        .post("http://localhost:3001/oauth", {
          email: result.user.email,
          username: result.user.displayName,
          avatar: result.user.photoURL,
        })
        .then((res) => {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          dispatch(signInSuccess(res.data));
          navigate("/");
        })
        .catch((err) => {
          dispatch(signInFailure(err.message));
        });
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <Button type="button" onClick={handleOAuth}>
      Continue with Google
    </Button>
  );
}

export default OAuth;
