import { useEffect, useRef, useState } from 'react';
import { Item } from '../bindings/Item.ts';

export default (props: { id: string, item: Item }) => {
  const [complete, setComplete] = useState(props.item.complete);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only save state when updating the initial state
    fetch(`changeItemStatus/${props.id}/${complete}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      console.log("Request complete! response:", res);
    });
  }, [complete]);

  return <li>
    <label >
      <input type="checkbox" defaultChecked={complete} onChange={() => setComplete(state => !state)} />
      {props.item.content}
    </label>
  </li>;
};
