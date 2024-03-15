// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const favorite = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const blogCounts = {};

  blogs.forEach((blog) => {
    if (Object.prototype.hasOwnProperty.call(blogCounts, blog.author)) {
      blogCounts[blog.author]++;
    } else {
      blogCounts[blog.author] = 1;
    }
  });

  let mostBlogsAuthor = "";
  let maxBlogs = 0;

  Object.keys(blogCounts).forEach((author) => {
    // console.log(`blogCount author : ${blogCounts[author]}`);
    if (blogCounts[author] > maxBlogs) {
      maxBlogs = blogCounts[author];
      mostBlogsAuthor = author;
      // console.log(mostBlogsAuthor);
    }
  });

  return { author: mostBlogsAuthor, blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  const authorLikes = {};

  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes;
  });

  let topLikesAuthor = '';
  let maxLikes = 0;
  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      topLikesAuthor = author;
      maxLikes = authorLikes[author];
    }
  }
  return {
    author: topLikesAuthor,
    likes: maxLikes
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
