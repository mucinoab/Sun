import { useEffect, useState } from 'react';

import Checklist from './Checklist.tsx';
import './ChecklistTab.css';

export default (props: { userId: String }) => {
  const [listsIds, setListsIds] = useState<Array<number>>([]);

  useEffect(() => {
    // Get all the lists for the user
    fetch(`list/ids/${props.userId}`)
      .then(response => response.json())
      .then(ids => setListsIds(ids))
      .catch(console.error);
  }, [props.userId]);

  return <div className="list-container">
    {listsIds.map((l: number) => <Checklist key={"list" + l} id={l} />)}
    <div className="list">
      <img src="/public/+-symbol.svg" className="new-list-icon" title="delete" />
    </div>
  </div >;
};
