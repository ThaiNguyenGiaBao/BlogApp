import { TextInput, Select, FileInput, Button } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  return (
    <form className="h-screen flex flex-col max-w-3xl mx-auto px-10 gap-4">
      <h1 className="text-3xl font-bold py-5 text-center">Create a post</h1>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <TextInput
          className="flex-1"
          placeholder="Title"
          required
          id="title"
        ></TextInput>
        <Select>
          <option value="uncategory">Select the category</option>
          <option value="javascript">Javascript</option>
          <option value="react">React</option>
          <option value="math">Math</option>
        </Select>
      </div>
      <div className="flex justify-between">
        <FileInput id="image" label="Upload image" accept="image/*" />
        <Button>Upload image</Button>
      </div>
      <div>
        <ReactQuill
          theme="snow"
          className="h-72"
          placeholder="Write somethings..."
          required
        />
      </div>

      <Button gradientDuoTone="purpleToPink" className="mt-12" type="submit">
        Create post
      </Button>
    </form>
  );
}

export default CreatePost;
