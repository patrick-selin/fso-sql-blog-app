// run test coverage
// npm test -- --coverage --collectCoverageFrom='src/**/*.{jsx,js}'

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  test("<BlogForm /> updates parent state and calls onSubmit", async () => {
    const createBlog = jest.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlogPost={createBlog} />);

    const titleInput = screen.getByText("Title:");
    // console.log(`titleInput -------- ${titleInput}`);
    const authorInput = screen.getByText("Author:");
    const urlInput = screen.getByText("url:");
    const sendButton = screen.getByText("create");

    await user.type(titleInput, "title mies");
    await user.type(authorInput, "authori");
    await user.type(urlInput, "https://www.yle.fi");
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog).toHaveBeenCalledWith({
      title: "title mies",
      author: "authori",
      url: "https://www.yle.fi",
    });
  });
});
