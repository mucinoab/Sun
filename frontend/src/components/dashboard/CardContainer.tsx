import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Card from './Card';

const CardContainer = () => {
  let [trips, setTrips] = useState(Array<number>());
  let id = 1;

  useEffect(() => {
    fetch(`/user/${id}/trips`)
      .then((response) => response.json())
      .then((data) => setTrips(data));
  }, []);
  console.log(trips);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '95vh', maxWidth: '60%' }}>
      <Row xs={1} md={2} className="g-4">
        {trips.map((card, index) => (
          <Col key={index}>
            <Card tripId={card} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardContainer;
