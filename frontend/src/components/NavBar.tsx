import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

import './NavBar.css';

const NavBar = () => {
  return <Navbar className="navbar-style">
    <Container>
      <Navbar.Brand href="/">
        <img
          alt="Logo"
          src="/public/logo.svg"
          width="35"
          height="35"
          className="d-inline-block align-top"
        />{' '}
        Zenith Explorer
      </Navbar.Brand>

      <Nav className="justify-content-end">
        <Nav.Item>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="/signin">Sign In</Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="/signup">Sign Up</Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  </Navbar>;
};

export default NavBar;

