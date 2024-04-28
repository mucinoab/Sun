import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return <footer className="footer-style">
    <Container>
      <Row>
        <Col>
          <p className="text-center">&copy; 2024 Zenith Explorer</p>
          <p className="text-center">
            <a href="https://github.com/mucinoab/sun" target="_blank">
              Source Code
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>;
};

export default Footer;
