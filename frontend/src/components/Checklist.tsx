import { useEffect, useRef, useState } from 'react';

import { batchUpdateItems, updateTitle } from "./utils.ts";
import { Item } from '../bindings/Item.ts';
import { List } from '../bindings/List.ts';
import ChecklistItem from './ChecklistItem.tsx';
import "./Checklist.css";

interface DnDState {
  draggedFrom: number,
  draggedTo: number,
  isDragging: Boolean,
  originalOrder: Array<Item>,
  updatedOrder: Array<Item>
}

const initialList: List = {
  id: -1,
  title: "",
  items: []
};

const initialDnDState: DnDState = {
  draggedFrom: -1,
  draggedTo: -1,
  isDragging: false,
  originalOrder: [],
  updatedOrder: []
}

export default (props: { id: number }) => {
  const isInitialTitle = useRef(true);

  const [title, setTitle] = useState<string>("");
  const [list, setList] = useState<List>(initialList);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

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

  if (list.id === -1) return <div className="list"> Loading ... </div>;

  const items = list.items.map((i: Item, idx: number) => {
    return <li
      draggable="true"
      key={i.id}
      data-position={idx}
      className={dragAndDrop && dragAndDrop.draggedTo === Number(idx) ? "dropArea" : "item"}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ChecklistItem id={i.id} item={i} />
      <img src="/public/x-symbol.svg" title="delete" className="delete-icon" onClick={() => handleDelete(i.id)} />
    </li>;
  });

  return <div className="list">
    <div className="remove">
      <img src="/public/x-symbol.svg" className="new-list-icon" title="delete" />
    </div>

    <input
      className="list-title"
      type="input"
      value={title}
      onInput={e => { handleTitleInput(e) }}
    />
    <ul>
      {items}
    </ul>
    <button onClick={() => handleClick()}> + </button>
  </div >;

  function handleClick() {
    fetch(`item/${props.id}/${list?.items.length}`, {
      method: "POST",
    })
      .then(response => response.json())
      .then((newItem: Item) => {
        setList(l => {
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
      if (l.id === -1) return l;
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

  function onDragStart(e: React.DragEvent<HTMLLIElement>) {
    const initialPosition = Number(e.currentTarget.dataset.position); // ordinality

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: list.items
    });

    e.dataTransfer.setData("text/html", '');
  }

  function onDrop() {
    const itemsToUpdate: Array<Item> = dragAndDrop.updatedOrder.map((i: Item, idx: number) => {
      return { ...i, ordinality: idx }; // Update ordinality
    });

    setList(l => { return { ...l, items: itemsToUpdate } });
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: -1,
      draggedTo: -1,
      isDragging: false
    });

    batchUpdateItems(itemsToUpdate);
  }

  function onDragOver(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();

    let newList = dragAndDrop.originalOrder;
    const draggedTo = Number(e.currentTarget.dataset.position);
    const draggedFrom = dragAndDrop.draggedFrom;
    const itemDragged = newList[draggedFrom];

    if (draggedTo !== dragAndDrop.draggedTo) {
      const remainingItems = newList.filter((_, index) => index !== draggedFrom);

      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: [
          ...remainingItems.slice(0, draggedTo),
          itemDragged,
          ...remainingItems.slice(draggedTo)
        ],
        draggedTo: draggedTo
      })
    }
  }
};
