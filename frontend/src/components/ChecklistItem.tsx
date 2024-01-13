import { useEffect, useRef, useState } from 'react';
import { Item } from '../bindings/Item.ts';
import { updateItem } from "./utils.ts";
import "./ChecklistItem.css";

export default (props: { id: string, item: Item }) => {
  const [item, setItem] = useState<Item>(props.item);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    return updateItem(item);
  }, [item.complete, item.ordinality, item.content]);

  return <li>
    <input type="checkbox" defaultChecked={item.complete} onChange={() => handleChange()} />
    <input type="input" value={item.content?.toString()} onInput={e => handleInput(e)} />
  </li>;

  function handleChange() {
    setItem(i => { return { ...i, complete: !i.complete }; });
  }

  function handleInput(e: any) {
    setItem(i => { return { ...i, content: e.target.value }; });
  }
};
