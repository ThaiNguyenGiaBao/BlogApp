import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Alert, Modal, Button, Label } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { TextInput } from "flowbite-react";
import axios from "axios";
import { updateSuccess, updateFailure, signOut } from "../redux/user/userSlice";

function DashProfile() {
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [imgDownload, setImgDownload] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const fileRef = useRef();
  const [isUpload, setIsUpload] = useState(false);

  const user = useSelector((state) => state.user.user);
  //console.log(user);
  const dispatch = useDispatch();

  const handleUpdateFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImgUrl(URL.createObjectURL(file));
    }
  };
  const handleUploadImage = (file) => {
    setIsUpload(true);
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress updates here if needed
        console.log(
          "Upload is " +
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100 +
            "% done"
        );
      },
      (error) => {
        console.log("Could not upload image", error);
        setError("Could not upload image");
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
    setIsUpload(false);
  };
  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    axios
      .put(`http://14.225.192.183:8000/user/update/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Include credentials in the request
      })
      .then((res) => {
        console.log(res.data);
        dispatch(updateSuccess(res.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(updateFailure(err.message));
      });
  };

  const handleSignOut = () => {
    axios.get("http://14.225.192.183:8000/user/signout").then((res) => {
      // Remove token in local storage
      localStorage.removeItem("token");
      dispatch(signOut());
      window.location.href = "/signin";
    });
  };

  useEffect(() => {
    if (file) {
      handleUploadImage(file);
    }
  }, [file]);
  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
    });
  }, [user]);

  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="  bg-gray-100 dark:bg-slate-800 m-5 rounded-lg pt-12 p-8">
        <div className="flex flex-col items-center ">
          <img
            src={imgUrl || (user && user.avatar)}
            alt="user"
            className="w-40 h-40 rounded-full mb-4 object-cover border-4 border-gray-300 dark:border-gray-700"
          />
          {error && <Alert color="failure">{error}</Alert>}
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-xl">{user.email}</p>
        </div>

        <div className="flex justify-around mt-10">
          <button
            onClick={() => setOpenModal(true)}
            type="button"
            class="text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Update
          </button>

          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Update information</Modal.Header>
            <form>
              <Modal.Body>
                <div className="space-y-6">
                  =
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpdateFile}
                    ref={fileRef}
                    hidden
                  />
                  <img
                    src={imgUrl || (user && user.avatar)}
                    alt="user"
                    className="mx-auto w-40 h-40 rounded-full mb-4 object-cover hover:cursor-pointer border-4 border-gray-300 dark:border-gray-700"
                    onClick={() => fileRef.current.click()}
                  />
                  = {error && <Alert color="failure">{error}</Alert>}
                  <div className=" block">
                    <Label htmlFor="username" value="Name" />
                    <TextInput
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInfoChange(e)}
                    />
                  </div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Email" />
                    <TextInput
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInfoChange(e)}
                    />
                  </div>
                  <div className="mb-2 block">
                    <Label htmlFor="password" value="Password" />
                    <TextInput
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInfoChange(e)}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => {
                    setOpenModal(false);
                    handleUpdate();
                  }}
                  disabled={isUpload}
                >
                  Update
                </Button>
                <Button
                  color="gray"
                  onClick={() => setOpenModal(false)}
                  disabled={isUpload}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <button
            onClick={handleSignOut}
            type="button"
            class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Sign Out
          </button>
        </div>
      </div>
      
    </div>
   
  );
}

export default DashProfile;
