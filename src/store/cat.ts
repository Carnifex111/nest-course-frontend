import { createEvent, createStore, createEffect, sample } from "effector";
import { Cat } from "../types/cat";

export const fetchCatsFx = createEffect(async () => {
  const response = await fetch("http://localhost:3000/cats");
  return response.json();
});

export const addCatFx = createEffect(async (cat: Cat) => {
  const response = await fetch("http://localhost:3000/cats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cat),
  });
  return response.json();
});

export const deleteCatFx = createEffect(async (id: number) => {
  await fetch(`http://localhost:3000/cats/${id}`, {
    method: "DELETE",
  });
  return id;
});

export const updateCatFx = createEffect(async (cat: Cat) => {
  const response = await fetch(`http://localhost:3000/cats/${cat.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cat),
  });
  return response.json();
});

export const loadCats = createEvent<void>();
export const addCat = createEvent<Cat>();
export const deleteCat = createEvent<number>();
export const updateCat = createEvent<Cat>();

export const $cats = createStore<Cat[]>([])
  .on(fetchCatsFx.doneData, (_, cats) => cats)
  .on(addCatFx.doneData, (state, newCat) => [...state, newCat])
  .on(deleteCatFx.doneData, (state, id) => state.filter((cat) => cat.id !== id))
  .on(updateCatFx.doneData, (state, updatedCat) =>
    state.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
  );

sample({
  clock: loadCats,
  target: fetchCatsFx,
});

sample({
  clock: addCat,
  target: addCatFx,
});

sample({
  clock: deleteCat,
  target: deleteCatFx,
});

sample({
  clock: updateCat,
  target: updateCatFx,
});
