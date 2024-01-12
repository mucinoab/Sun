import { useEffect, useState } from 'react';
import { List, Item } from '../types';
import ChecklistItem from './ChecklistItem';

export default () => {
  // Get check list items from back end.
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("lists/2")
      .then(r => r.json())
      .then(l => {
        console.log(l);
        setItems(l);
      })
      .catch(console.error);
  }, []);

  let lists = items.map((l: List) => <ul> {l.items.map((i: Item) => <ChecklistItem id="" item={i}></ChecklistItem >)}</ul >);

  return <div> {lists} </div >;
};
