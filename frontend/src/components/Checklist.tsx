import { useEffect, useRef, useState } from 'react';

import { batchUpdateItems, updateTitle } from "./utils.ts";
import { Item } from '../bindings/Item.ts';
import { List } from '../bindings/List.ts';
import ChecklistItem from './ChecklistItem.tsx';
import "./Checklist.css";

export default (props: { id: number }) => {
  const isInitialTitle = useRef(true);

  const [list, setList] = useState<List>();
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    // Get check list items from back end.
    fetch(`list/${props.id}`)
      .then(response => response.json())
      .then((l: List) => {
        setList(l);
        setTitle(l.title);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isInitialTitle.current || title === undefined) return;
    return updateTitle(props.id, title);
  }, [title]);

  if (list === undefined) return <div className="list"> Loading ... </div>;

  const items = list.items.map((i: Item) => {
    return <div className="item">
      <ChecklistItem key={"item" + i.id} id={i.id.toString()} item={i} />
      <img src="/public/x-symbol.svg" title="delete" className="delete-icon" onClick={() => handleDelete(i.id)} />
    </div>;
  });

  return <div className="list">
    <input className="list-title" type="input" value={title} onInput={e => { handleTitleInput(e) }} />
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

    let itemsToUpdate: Array<Item> = [];

    setList(l => {
      // https://react.dev/learn/updating-arrays-in-state
      if (l === undefined) return l;
      const newItems: Array<Item> = l.items.map((item: Item, pos: number) => {
        if (pos > idx) {
          // Update ordinality
          const newItem: Item = { ...item, ordinality: item.ordinality - 1 };
          itemsToUpdate.push(newItem);
          return newItem;
        } {
          return { ...item };
        }
      }).filter((i: Item) => i.id !== id);

      return { ...l, items: newItems };
    });

    fetch(`item/${id}`, { method: "DELETE" });
    batchUpdateItems(itemsToUpdate);
  }

  function handleTitleInput(e: any) {
    isInitialTitle.current = false;
    setTitle(e.target.value);
  }
};
