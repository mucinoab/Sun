import { ToastContainer as ToastContainerBootstrap } from 'react-bootstrap';

interface Props {
  toastMessages: Array<any>;
}

const ToastContainer: React.FC<Props> = ({ toastMessages }) => {
  return <div
    className="position-static"
    style={{ minHeight: '240px' }}
  >
    <ToastContainerBootstrap className="p-3" position="top-end" style={{ zIndex: 1 }}>
      {toastMessages}
    </ToastContainerBootstrap>
  </div>;
}

export default ToastContainer;
