import ToastContainer from './utils/ToastContainer';
import ToastMessage from './utils/ToastMessage';

import { Container, Form, Button, Row } from 'react-bootstrap';
import { useState } from 'react';

import './LogIn.css';

const LogIn = () => {
  let [toastMessages, setToastMessages] = useState<Array<any>>([]);

  function handleSubmit(event: any) {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      return;
    }

    fetch('/login', {
      method: 'POST',
      // @ts-ignore
      body: new URLSearchParams(new FormData(form)),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      redirect: 'follow'
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else if (!response.ok) {
        setToastMessages((s: any) => [...s, <ToastMessage key={s.length} message="Invalid email or password" show={true} />]);
      }
    }).catch((error) => {
      console.error('Error:', error);
      setToastMessages((s: any) => [...s, <ToastMessage key={s.length} message="An error occurred. Please try again later." show={true} />]);
    });
  }

  return (
    <Container className="login-form-container">
      <img src="/public/logo.svg" alt="website logo" className="m-4" width="auto" height="75em" />
      <h2 className="text-center mb-4">
        Sign in to Zenith Explorer
      </h2>

      <Row>
        <Form className="login-form" onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email address *</Form.Label>
            <Form.Control name="email" type="email" placeholder="Enter email" required={true} />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password *</Form.Label>
            <Form.Control name="password" type="password" placeholder="Password" required={true} />
          </Form.Group>

          <Button className="custom-button btn-block" type="submit">
            Sign In
          </Button>
        </Form>
      </Row>

      <Row>
        <div className="login-form mt-4">
          New to Zenith Explorer? <a href="/pages/signup.html">Create an account</a>
        </div>
      </Row>

      <ToastContainer toastMessages={toastMessages} />
    </Container>
  );
};

export default LogIn;
