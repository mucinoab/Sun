import ToastContainer from './utils/ToastContainer';
import ToastMessage from './utils/ToastMessage';

import { Container, Form, Button, Row } from 'react-bootstrap';
import { useState } from 'react';

import './SignUp.css';

const SignUp = () => {
  let [toastMessages, setToastMessages] = useState<Array<any>>([]);

  function handleSubmit(event: any) {
    const password = event.target.password.value;
    const confirmPassword = event.target.formPasswordConfirmation.value;
    const form = event.currentTarget;

    if (form.checkValidity() && password !== confirmPassword) {
      setToastMessages((s: any) => [...s, <ToastMessage key={s.length} message="Passwords do not match" show={true} />]);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  return (
    <Container className="signup-form-container">
      <h2 className="text-center">
        Welcome to Zenith Explorer!
      </h2>
      <h2 className="text-center mb-4">
        Let’s begin the adventure
      </h2>

      <Row>
        <Form className="signup-form" action="/signup" method="POST" onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username *</Form.Label>
            <Form.Control name="username" type="text" placeholder="Enter your username" required={true} />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email address *</Form.Label>
            <Form.Control name="email" type="email" placeholder="Enter email" required={true} />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password *</Form.Label>
            <Form.Control name="password" type="password" placeholder="Password" required={true} />
          </Form.Group>

          <Form.Group controlId="formPasswordConfirmation" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" required={true} />
          </Form.Group>

          <Button className="custom-button btn-block" type="submit">
            Create Account
          </Button>
        </Form>
      </Row>
      <ToastContainer toastMessages={toastMessages} />
    </Container>
  );
};

export default SignUp;
