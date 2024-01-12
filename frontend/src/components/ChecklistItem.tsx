import { useEffect, useRef, useState } from 'react';
import { Item } from '../bindings/Item.ts';

export default (props: { id: string, item: Item }) => {
  const [item, setItem] = useState<Item>(props.item);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only save state when updating the initial state
    fetch(`item/${props.id}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  }, [item.complete, item.ordinality, item.content]);

  return <li>
    <label >
      <input type="checkbox" defaultChecked={item.complete} onChange={e => handleChange(e)} />
      {item.content}
    </label>
  </li>;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.type === "checkbox") {
      setItem(i => {
        i.complete = !i.complete;
        return i;
      });
    }
  }
};
