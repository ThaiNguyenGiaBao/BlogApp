import { useParams } from "react-router-dom";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import React, { useEffect } from "react";
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

function UpdatePost() {
  const [postData, setPostData] = useState({
    title: "",
    category: "",
    img: "",
    content: "",
  });
  const [error, setError] = useState("");
  const { id } = useParams();
  //console.log(postData);
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
      .put(`http://localhost:3001/post/update/${id}`, {...postData, updateAt: new Date()}, {
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

  useEffect(() => {
    axios
      .get(`http://localhost:3001/post/getposts?postId=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        //console.log(res.data.posts);
        setPostData({
          title: res.data.posts[0].title,
          category: res.data.posts[0].category,
          content: res.data.posts[0].content,
          img: res.data.posts[0].img,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);

  return (
    <form
      className="min-h-screen flex flex-col max-w-3xl mx-auto px-10 gap-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold py-5 text-center">Update post</h1>
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
      <Button gradientDuoTone="purpleToPink" type="submit">
        Update
      </Button>
    </form>
  );
}

export default UpdatePost;
