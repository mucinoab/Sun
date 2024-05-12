import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Trip } from '../../bindings/Trip';
import { Placeholder } from 'react-bootstrap';


interface CardProps {
  tripId: number;
}

export default (props: CardProps) => {
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    fetch(`/trip/${props.tripId}`)
      .then((res) => {
        if (res.ok) return res.json();

        throw new Error('Network response was not ok');
      })
      .then((data: Trip) => {
        console.log(data);
        setTrip(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (trip) {
    return <Card style={{ width: '32rem' }} as="a" href={`/pages/trip.html?trip=${props.tripId}`}>
      <Card.Img variant="top" src={trip.image?.toString()} />
      <Card.Body>
        <Card.Title>{trip.title}</Card.Title>
        <Card.Text>
          <ul >
            <li > NOTAS </li >
            <li > PLACES </li >
            <li > TODOS </li >
          </ul>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{trip.updated_at}</Card.Footer>
    </Card >;
  }

  // Placeholder for loading state
  return (<Card style={{ width: '32rem' }} className='m-4'>
    <Card.Img variant="top" />
    <Card.Body>
      <Placeholder as={Card.Title} animation="glow">
        <Placeholder xs={6} />
      </Placeholder>
      <Placeholder as={Card.Text} animation="glow">
        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
        <Placeholder xs={6} /> <Placeholder xs={8} />
      </Placeholder>
    </Card.Body>
    <Placeholder as={Card.Footer} animation="glow" >
      <Placeholder xs={2} /> <Placeholder xs={3} />
    </Placeholder>
  </Card>
  );
}
