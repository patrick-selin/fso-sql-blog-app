import { useState } from "react";

const Blog = ({ blog, updateBlogPostLikes, deleteBlogPost }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLikeButton = () => {
    // console.log("Like button clicked");
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    updateBlogPostLikes(blog.id, blogToUpdate);
  };

  const handleDeletePost = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogPost(blog.id);
    }
  };

  return (
    <div className="blog" data-testid="blog-component">
      {/* test that the title shows, not the modal */}
      <div className="blog-title">
        <p>
          {blog.title} - {blog.author}
        </p>

        <button className="left-margin" onClick={toggleShowDetails}>
          {showDetails ? "hide" : "show"}
        </button>
      </div>

      {showDetails && (
        <div className="blog-modal">
          <div>{blog.url}</div>
          <div>
            Likes: {blog.likes}
            <button id="like-button" onClick={handleLikeButton}>like</button>
          </div>
          <div>? {blog.user ? blog.user.name : <i>user unknow</i>}</div>
          <button id="remove-button" onClick={handleDeletePost}>remove</button>
        </div>
      )}
    </div>
  );
};
export default Blog;
