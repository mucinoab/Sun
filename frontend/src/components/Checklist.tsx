import { useEffect, useState } from 'react';

import { updateItem } from "./utils.ts";
import { Item } from '../bindings/Item.ts';
import { List } from '../bindings/List.ts';
import ChecklistItem from './ChecklistItem.tsx';
import "./Checklist.css";

export default (props: { id: string }) => {
  const [list, setList] = useState<List>();

  useEffect(() => {
    // Get check list items from back end.
    fetch(`list/${props.id}`)
      .then(response => response.json())
      .then((l: List) => setList(l))
      .catch(console.error);
  }, []);

  if (list === undefined) return <div> Loading ... </div>;

  const items = list.items.map((i: Item) => {
    return <div className='item'>
      <ChecklistItem key={"item" + i.id} id={i.id.toString()} item={i} />
      <img src="/public/x-symbol.svg" title="delete" className="delete-icon" onClick={() => handleDelete(i.id)} />
    </div>;
  });

  return <div>
    <h2>{list.title}</h2>
    <ul> {items} </ul>
    <button onClick={() => handleClick()}> + </button>
  </div >;

  function handleClick() {
    fetch(`item/${props.id}/${list?.items.length}`, {
      method: "POST",
    })
      .then(response => response.json())
      .then((newItem: Item) => {
        setList(l => {
          if (l === undefined) return;
          return { ...l, items: [...l.items, newItem] };
        });
      })
      .catch(console.error);
  }

  function handleDelete(id: number) {
    const idx = list?.items.findIndex(i => i.id === id);
    if (idx === -1 || idx === undefined) return;

    setList(l => {
      if (l === undefined) return l;
      // https://react.dev/learn/updating-arrays-in-state
      const newItems: Array<Item> = l.items.map((item: Item, pos: number) => {
        if (pos > idx) {
          // Update ordinality
          // TODO maybe a special method that does this in just one request
          const newItem: Item = { ...item, ordinality: item.ordinality - 1 };
          updateItem(newItem);
          return newItem;
        } {
          return { ...item };
        }
      }).filter((i: Item) => i.id !== id);

      return { ...l, items: newItems };
    });

    fetch(`item/${id}`, { method: "DELETE" });
  }
};
