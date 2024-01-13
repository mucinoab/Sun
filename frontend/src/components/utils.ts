import { Item } from '../bindings/Item.ts';

export function updateItem(item: Item) {
  const timeoutId = setTimeout(() => {
    // Only save state when updating the initial state and only after multiple
    // updates in a short time period.
    fetch(`item/${item.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  }, 300);

  return () => clearTimeout(timeoutId); // Clean up last timeout.
}

export function batchUpdateItems(items: Array<Item>) {
  fetch("item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
}
