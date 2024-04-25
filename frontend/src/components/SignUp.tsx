import { Container, Form, Button, Row } from 'react-bootstrap';
import './SignUp.css';

const SignUp = () => {
  return (
    <Container className="signup-form-container">
        <h2 className="text-center">
          Welcome to Zenith Explorer!
        </h2>
        <h2 className="text-center mb-4">
          Let’s begin the adventure
        </h2>

      <Row>
        <Form className="signup-form">
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Username *</Form.Label>
            <Form.Control type="text" placeholder="Enter your username" />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email address *</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password *</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password"/>
          </Form.Group>

          <Button className="custom-button btn-block" type="submit">
            Create Account
          </Button>

        </Form>
      </Row>
    </Container>
  );
};

export default SignUp;
