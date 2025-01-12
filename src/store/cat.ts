import { createEvent, createStore, createEffect, sample } from "effector";
import { Cat } from "../types/cat";

// Эффект для загрузки данных о котах
export const fetchCatsFx = createEffect(async () => {
  const response = await fetch("http://localhost:3000/cats");
  return response.json();
});

// Эффект для добавления кота
export const addCatFx = createEffect(async (cat: Cat) => {
  const response = await fetch("http://localhost:3000/cats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cat),
  });
  return response.json();
});

// События
export const loadCats = createEvent<void>(); // Событие для загрузки котов
export const addCat = createEvent<Cat>(); // Событие для добавления кота

// Стор для котов
export const $cats = createStore<Cat[]>([]) // Стор с типизацией массива котов
  .on(fetchCatsFx.doneData, (_, cats) => cats) // Обновляем стор после загрузки
  .on(addCatFx.doneData, (state, newCat) => [...state, newCat]); // Добавляем нового кота

// Запускаем эффекты при событиях
sample({
  clock: loadCats, // Событие загрузки
  target: fetchCatsFx, // Эффект загрузки данных
});

sample({
  clock: addCat, // Событие добавления кота
  target: addCatFx, // Эффект добавления кота
});
