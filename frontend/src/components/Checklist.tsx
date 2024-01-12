import { useEffect, useState } from 'react';

import { Item } from '../bindings/Item.ts';
import { List } from '../bindings/List.ts';
import ChecklistItem from './ChecklistItem';

export default (props: { id: string }) => {
  const [list, setList] = useState<List>();

  useEffect(() => {
    // Get check list items from back end.
    fetch(`list/${props.id}`)
      .then(response => response.json())
      .then(lists => setList(lists))
      .catch(console.error);
  }, []);

  if (list !== undefined) {
    const items = list.items.map((i: Item) => <ChecklistItem key={"item" + i.id} id={i.id.toString()} item={i} />);
    return <div>
      <h2>{list.title}</h2>
      <ul> {items} </ul>
      <button onClick={e => handleClick(e)}> + </button>
    </div >;
  } else {
    // TODO add fancy loading animation
    return <div> Loading ... </div>;
  }

  function handleClick(_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    fetch(`item/${props.id}/${list?.items.length}`, {
      method: "POST",
    })
      .then(response => response.json())
      .then(newItem => {
        setList(l => {
          if (l === undefined) return;
          l.items.push(newItem);
          return { ...l };
        });
      })
      .catch(console.error);
  }
};
