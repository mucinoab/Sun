import { Item } from '../bindings/Item.ts';

export function updateItem(item: Item) {
  return debounce(
    () => {
      fetch(`item/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
    }
  );
}

export function batchUpdateItems(items: Array<Item>) {
  fetch("item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
}

export function updateTitle(listId: number, newTitle: string) {
  return debounce(
    () => {
      fetch(`list/${listId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTitle),
      })
    }
  );
}

function debounce(fn: () => void): () => void {
  const timeoutId = setTimeout(() => {
    fn();
  }, 300);

  return () => clearTimeout(timeoutId); // Clean up last timeout.
}
