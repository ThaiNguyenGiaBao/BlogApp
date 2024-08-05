import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";

function CreatePost() {
  const [postData, setPostData] = useState({
    title: "",
    category: "uncategory",
    img: "",
    content: "",
  });
  console.log(postData.content);
  const [error, setError] = useState("");
  const handleUpdateFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUploadImage(file);
    }
  };
  const handleUploadImage = (file) => {
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
        //setError("Could not upload image");
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setPostData({ ...postData, img: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    if (e.target == null) {
      setPostData({ ...postData, content: e });
    } else {
      setPostData({ ...postData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .post("http://14.225.192.183/api/post/create", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        window.location.href = "/dashboard?tab=posts";
      })
      .catch((err) => {
        setError(err.response.data);
        console.log(err.response.data);
      });
  };

  return (
    <form
      className="min-h-screen flex flex-col max-w-3xl mx-auto px-10 gap-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold py-5 text-center">Create a post</h1>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <TextInput
          className="flex-1"
          placeholder="Title"
          id="title"
          value={postData.title}
          onChange={(e) => handleChange(e)}
        ></TextInput>
        <Select
          id="category"
          value={postData.category}
          onChange={(e) => handleChange(e)}
        >
          <option value="uncategory">Select the category</option>
          <option value="javascript">Javascript</option>
          <option value="react">React</option>
          <option value="math">Math</option>
        </Select>
      </div>
      <div className="flex justify-between">
        <FileInput
          id="image"
          label="Upload image"
          accept="image/*"
          className="flex-1"
          onChange={(e) => handleUpdateFile(e)}
        />
        {/* <Button>Upload image</Button> */}
      </div>
      {postData.img && (
        <img
          src={postData.img}
          alt="preview"
          className="w-full h-72 object-cover"
        />
      )}
      <div id="content">
        <ReactQuill
          id="content"
          theme="snow"
          className="h-72 mb-12"
          placeholder="Write somethings..."
          value={postData.content}
          onChange={(e) => handleChange(e)}
        />
      </div>
      {error && (
        <Alert color="failure" className="text-md">
          {error}
        </Alert>
      )}

      <div>
        <label
          for="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Write HTML
        </label>
        <textarea
          id="content"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          //value={postData.content}
          // onChange={(e) => handleChange(e)}
          placeholder="Write your html here..."
        ></textarea>
      </div>

      <Button gradientDuoTone="purpleToPink" type="submit">
        Create post
      </Button>
    </form>
  );
}

export default CreatePost;
