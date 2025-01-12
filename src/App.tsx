import React, { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { $cats, addCat, loadCats } from "./store/cat";
import { Cat } from "./types/cat";
import {
  AdaptivityProvider,
  AppRoot,
  Button,
  FormItem,
  FormLayoutGroup,
  Group,
  Input,
  Panel,
  PanelHeader,
  Placeholder,
  Separator,
} from "@vkontakte/vkui";

import "@vkontakte/vkui/dist/vkui.css";

function App() {
  const cats = useUnit($cats); // Получаем состояние котов
  const [form, setForm] = useState<Partial<Omit<Cat, "id">>>({
    name: "",
    age: 0,
    breed: "",
  });

  useEffect(() => {
    loadCats(); // Загружаем список котов при монтировании
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age) {
      alert("Пожалуйста, заполните имя и возраст");
      return;
    }
    addCat({
      ...form,
      id: 0, // ID генерируется сервером
    } as Cat);
    setForm({ name: "", age: 0, breed: "" }); // Очищаем форму
  };

  return (
    <AdaptivityProvider>
      <AppRoot>
        <Panel>
          <PanelHeader>Список котов</PanelHeader>
          <Group>
            {cats.length === 0 ? (
              <Placeholder>Котов пока нет</Placeholder>
            ) : (
              <ul style={{ padding: "16px" }}>
                {cats.map((cat: Cat) => (
                  <li key={cat.id} style={{ marginBottom: "8px" }}>
                    <strong>{cat.name}</strong> — {cat.age} лет, порода:{" "}
                    {cat.breed}
                    <Separator style={{ margin: "8px 0" }} />
                  </li>
                ))}
              </ul>
            )}
          </Group>

          <Group>
            <PanelHeader>Добавить кота</PanelHeader>
            <form onSubmit={handleSubmit}>
              <FormLayoutGroup mode="vertical">
                <FormItem top="Имя">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </FormItem>
                <FormItem top="Возраст">
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) =>
                      setForm({ ...form, age: Number(e.target.value) })
                    }
                    required
                  />
                </FormItem>
                <FormItem top="Порода">
                  <Input
                    value={form.breed}
                    onChange={(e) =>
                      setForm({ ...form, breed: e.target.value })
                    }
                  />
                </FormItem>
                <FormItem>
                  <Button size="l" stretched type="submit">
                    Добавить кота
                  </Button>
                </FormItem>
              </FormLayoutGroup>
            </form>
          </Group>
        </Panel>
      </AppRoot>
    </AdaptivityProvider>
  );
}

export default App;
