import { useEffect, useState } from "react";
import { Trip } from "../../bindings/Trip";

import "./Trip.css";


interface TripProps {
  tripId: string | null;
};

export default ({ tripId }: TripProps) => {
  if (!tripId) window.location.href = "pages/dashboard.html";

  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    fetch(`/trip/${tripId}`)
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
    return (

      <div className="trip-info center:c">
        <h2>Japan (01/10 - 15/10)</h2>
        <p>3 Notes</p>
        <p>4 Places</p>
        <p>1 Uncompleted task</p>
        <p className="last-updated">Last updated 3 mins ago</p>
      </div>
    );
  }

  return "No trip ?";
};
