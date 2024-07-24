import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";
import { deleteLogin } from "../backend/api";
import { LoginDialog } from "./LoginDialog";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../backend/LoginInfo";

export default function Header() {
  const { loginInfo, setLoginInfo } = useLoginContext();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();

  // Führe Logout (mittels api.ts/deleteLogin) durch
  const doLogout = async () => {
    await deleteLogin();
    setLoginInfo(false);
    navigate("/");
  };

  useEffect(() => {}, [loginInfo]);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Trinkprotokolle
        </Navbar.Brand>
        <Nav className="Meine-Nav-Bar">
          <LinkContainer to="/">
            <Nav.Link>Übersicht</Nav.Link>
          </LinkContainer>
          {loginInfo && loginInfo.role === "a" && (
            <LinkContainer to="/admin">
              <Nav.Link>Admin</Nav.Link>
            </LinkContainer>
          )}

          {loginInfo && (
            <LinkContainer to="/prefs">
              <Nav.Link>Preferences</Nav.Link>
            </LinkContainer>
          )}
          {loginInfo ? (
            <Button variant="outline-warning" onClick={() => doLogout()}>
              Logout
            </Button>
          ) : (
            <Button
              variant="outline-success"
              onClick={() => setShowLoginDialog(true)}
            >
              Login
            </Button>
          )}
          <hr />
          <LoginDialog
            open={showLoginDialog}
            onHide={() => setShowLoginDialog(false)}
          />
        </Nav>
      </Container>
    </Navbar>
  );
}
