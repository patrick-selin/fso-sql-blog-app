describe("BlogPost app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3007/api/testing/reset");

    const user = {
      name: "Olen Aaa",
      username: "aaaa",
      password: "aaaa",
    };

    cy.request("POST", "http://localhost:3007/api/users/", user);
    cy.visit("http://localhost:3007");
  });

  // eslint-disable-next-line jest/expect-expect
  it("5.17 Login form is is shown by defaul", function () {
    cy.contains("blogs");
    cy.get("button").contains("Login").should("exist");
  });

  describe("5.18 Loggin in", function () {
    // eslint-disable-next-line jest/expect-expect
    it("Login is successful, incorrect credentials", function () {
      cy.contains("Login").click();
      cy.get("#username").type("aaaa");
      cy.get("#password").type("aaaa");
      cy.get("#login-button").click();
      cy.contains("Olen Aaa logged in");
    });

    // eslint-disable-next-line jest/expect-expect
    it("Login is not succesful, correct credenials", function () {
      // TODO
      cy.contains("Login").click();
      cy.get("#username").type("eitoimi");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();
      cy.contains("Olen Aaa logged in").should("not.exist");
      cy.contains("invalid username or password");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });
});
