import { useState, useEffect, useRef } from "react";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
//
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";

const App = () => {
  //
  // hooks
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  //
  const addBlogFormRef = useRef();
  //

  useEffect(() => {
    blogService.getAllBlogPosts().then((blogs) => {
      setBlogs(blogs);
      console.log(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const notificationTimer = setTimeout(() => {
      setInfoMessage(null);
    }, 4000);
    return () => {
      clearTimeout(notificationTimer);
    };
  }, [infoMessage]);

  //
  // helper functions

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      // console.log(user);
    } catch (exception) {
      let errorMessage = "Login failed. Please try again.";
      if (
        exception.response &&
        exception.response.data &&
        exception.response.data.error
      ) {
        errorMessage = exception.response.data.error;
      }
      setInfoMessage({
        text: errorMessage,
        type: "error",
      });
    }
  };

  const handleLogOut = async () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
    console.log(user);
  };

  const createBlogPost = async ({ title, author, url }) => {
    try {
      const blog = await blogService.createNewBlogPost({
        title,
        author,
        url,
      });

      setBlogs([...blogs, blog]);
      setInfoMessage({
        text: `a new blog ${blog.title} by ${blog.author} added `,
        type: "success",
      });
      addBlogFormRef.current.toggleVisibility();
    } catch (exception) {
      // error message
      console.log("this is error messaae");
    }
  };

  const updateBlogPostLikes = async (postId, blogPostData) => {
    try {
      const updatedBlog = await blogService.updateBlogPost(
        postId,
        blogPostData
      );
      console.log(updatedBlog.likes);
      const newBlogs = blogs.map((blog) =>
        blog.id === postId ? updatedBlog : blog
      );
      setBlogs(newBlogs);
    } catch (exception) {
      setInfoMessage("error" + exception.response.data.error);
    }
  };

  const deleteBlogPost = async (postId) => {
    // TODO
    try {
      const deleteBlogPost = await blogService.deleteBlogPost(postId);

      const updatedBlogs = blogs.filter((blog) => blog.id !== postId);
      setBlogs(updatedBlogs);

      setInfoMessage({
        text: "Blog post deleted.",
        type: "success",
      });
    } catch (exception) {
      setInfoMessage("error" + exception.response.data.error);
    }
  };

  return (
    <>
      <div>
        <h2>blogs</h2>
        <Notification message={infoMessage} />
        {user ? (
          <>
            <p>{user.name} logged in</p>
            <button className="gap" onClick={handleLogOut}>
              log out
            </button>

            {/* list of blogs */}
            {blogs
              .sort((a, b) => a.likes - b.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  updateBlogPostLikes={updateBlogPostLikes}
                  deleteBlogPost={deleteBlogPost}
                />
              ))}

            {/* sort */}

            {/* new blog form visibility */}
            <Togglable buttonLabel="add new blog" ref={addBlogFormRef}>
              <BlogForm createBlogPost={createBlogPost} />
            </Togglable>
          </>
        ) : (
          <LoginForm handleLogin={handleLogin} />
        )}
        <br />
        <br />
      </div>
    </>
  );
};

export default App;
