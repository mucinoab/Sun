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
    return <div> <h2>{list.title}</h2> <ul> {items} </ul> </div >;
  } else {
    // TODO add fancy loading animation
    return <div> Loading ... </div>;
  }
};
