import { Container, Row, Col, Image, Button, ThemeProvider } from 'react-bootstrap';
import "./App.css";

export default () => (
  <ThemeProvider
    breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    minBreakpoint="xxs"
  >
    <Container fluid className="d-flex align-items-center justify-content-center vh-100">
      <Row className="align-items-center">
        <Col xs={12} md={6} className="text-center mt-4 mt-md-0">
          <div>
            <h1 className="display-2">Embark on Your Next Journey with Confidence!</h1>
            <Button size="lg" className="mt-3 custom-button" href="/">
              Start Planning Your Perfect Escape Today →
            </Button>
          </div>
        </Col>

        <Col xs={12} md={6} className="text-center">
          <Image src="/public/world.avif" fluid />
        </Col>
      </Row>
    </Container>
  </ThemeProvider>
);

