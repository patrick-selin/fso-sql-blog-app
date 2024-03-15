Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3007/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedUser", JSON.stringify(body));

    cy.visit("http://localhost:3007");
  });
});

Cypress.Commands.add("createBlog", ({ title, author, url, likes }) => {
  const tokeni =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFhYWEiLCJpZCI6IjY1ZDcyMTc4M2Q3OWJiM2RlNWQ0NDgwOSIsImlhdCI6MTcxMDMyNTE0NiwiZXhwIjoxNzEwNTQxMTQ2fQ.h5aGoPmn1v8MwC8xzHCpQYnrv-6b5COCNmux1I_WBvc";
  cy.request({
    url: "http://localhost:3007/api/blogs",
    method: "POST",
    body: { title, author, url, likes },
    headers: {
      Authorization: `Bearer ${tokeni}`,
    },
  });

  cy.visit("http://localhost:3007");
});
