import { useEffect, useState } from 'react';

import Checklist from './Checklist.tsx';

export default (props: { userId: String }) => {
  const [listsIds, setListsIds] = useState<Array<BigInt>>([]);

  useEffect(() => {
    // Get all the lists for the user
    fetch(`listsIds/${props.userId}`)
      .then(response => response.json())
      .then(ids => setListsIds(ids))
      .catch(console.error);
  }, [props.userId]);

  return <div> {listsIds.map((l: BigInt) => <Checklist key={"list" + l.toString()} id={l.toString()} />)} </div >;
};
