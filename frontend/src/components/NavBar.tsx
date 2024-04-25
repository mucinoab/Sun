import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

import './NavBar.css';

const NavBar = () => {
  return <Navbar className="navbar-style">
    <Container>
      <Navbar.Brand href="/" className="navbar-brand-text">
        <img
          alt="Logo"
          src="/public/logo.svg"
          width="50"
          height="50"
          className="d-inline-block align-top"
        />{' '}
        Zenith Explorer
      </Navbar.Brand>

      <Nav className="justify-content-end">
        <Nav.Item style={{ paddingRight: "1em" }}>
          <Nav.Link href="/about" className="nav-link-text">
            About
          </Nav.Link>
        </Nav.Item>

        <Nav.Item style={{ paddingRight: "1em" }}>
          <Nav.Link href="/signin" className="nav-link-text">
            Sign In
          </Nav.Link>
        </Nav.Item>

        <Nav.Item style={{ border: "3px solid gray", borderRadius: "5px" }}>
          <Nav.Link href="/pages/signup.html" className="nav-link-text" >
            Sign Up
          </Nav.Link>
        </Nav.Item>
      </Nav>

    </Container>
  </Navbar >;
};

export default NavBar;

