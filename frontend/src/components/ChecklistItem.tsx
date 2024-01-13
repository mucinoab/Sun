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

    const timeoutId = setTimeout(() => {
      // Only save state when updating the initial state and only after multiple
      // updates in a short time period.
      fetch(`item/${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }, 300);

    return () => clearTimeout(timeoutId); // Clean up last timeout.
  }, [item.complete, item.ordinality, item.content]);

  return <li>
    <label >
      <input type="checkbox" defaultChecked={item.complete} onChange={() => handleChange()} />
      <input type="input" value={item.content?.toString()} onInput={e => handleInput(e)} />
    </label>
  </li>;

  function handleChange() {
    setItem(i => { return { ...i, complete: !i.complete }; });
  }

  function handleInput(e: any) {
    setItem(i => { return { ...i, content: e.target.value }; });
  }
};
