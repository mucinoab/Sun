import { useEffect, useState } from 'react';

import { Item } from '../bindings/Item.ts';
import { List } from '../bindings/List.ts';
import ChecklistItem from './ChecklistItem';

export default () => {
  // Get check list items from back end.
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("lists/2")
      .then(response => response.json())
      .then(lists => setItems(lists))
      .catch(console.error);
  }, []);

  let lists = items.map((l: List) => <ul> {l.items.map((i: Item) => <ChecklistItem id="" item={i}></ChecklistItem >)}</ul >);

  return <div> {lists} </div >;
};
