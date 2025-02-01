import React, { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { $cats, addCat, loadCats, deleteCat, updateCat } from "./store/cat";
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
import { Icon20MessageAddOutline } from "@vkontakte/icons";

function App() {
  const cats = useUnit($cats);
  const [form, setForm] = useState<Partial<Omit<Cat, "id">>>({
    name: "",
    age: 0,
    breed: "",
  });

  const [editCat, setEditCat] = useState<Cat | null>(null);

  useEffect(() => {
    loadCats();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age) {
      alert("Пожалуйста, заполните имя и возраст");
      return;
    }
    if (editCat) {
      updateCat({ ...editCat, ...form } as Cat);
      setEditCat(null);
    } else {
      addCat({ ...form } as Cat);
    }
    setForm({ name: "", age: 0, breed: "" });
  };

  const handleEdit = (cat: Cat) => {
    setEditCat(cat);
    setForm({ name: cat.name, age: cat.age, breed: cat.breed });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить кота?")) {
      deleteCat(id);
    }
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
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                    >
                      <Button size="s" onClick={() => handleEdit(cat)}>
                        Редактировать
                      </Button>
                      <Button size="s" onClick={() => handleDelete(cat.id)}>
                        Удалить
                      </Button>
                    </div>
                    <Separator style={{ margin: "8px 0" }} />
                  </li>
                ))}
              </ul>
            )}
          </Group>

          <Group>
            <PanelHeader>
              {editCat
                ? `Редактирование кота: ${editCat.name}`
                : "Добавить кота"}{" "}
              <Icon20MessageAddOutline />
            </PanelHeader>
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
                    {editCat ? "Сохранить изменения" : "Добавить кота"}
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
