import { useState } from 'react';
import { Toast } from 'react-bootstrap';

interface ToastMessageProps {
  message: string;
  show: boolean;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ message, show }) => {
  const [showToast, setShowToast] = useState(show);

  return (
    <Toast
      show={showToast}
      onClose={() => setShowToast(false)}
      delay={3500}
      autohide
    >
      <Toast.Header>
        <strong>Message</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default ToastMessage;
