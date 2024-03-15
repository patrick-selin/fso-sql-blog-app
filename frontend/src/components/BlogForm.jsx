import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlogPost }) => {
  // hooks
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitPost = (event) => {
    event.preventDefault();
    createBlogPost(formData);
    setFormData({ title: "", author: "", url: "" });
  };

  // return
  return (
    <div className="blog-adder">
      <h2>create new</h2>
      <form onSubmit={handleSubmitPost}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <label>
          Author:
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </label>

        <label>
          url:
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
          />
        </label>
        <button id="add-blog" type="submit">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlogPost: PropTypes.func.isRequired,
};

export default BlogForm;
