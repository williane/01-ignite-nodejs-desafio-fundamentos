import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;
      const users = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      try {
        const { title, description } = req.body;

        if (!title) {
          throw new Error("title é obrigatorio");
        }

        if (!description) {
          throw new Error("description é obrigatorio");
        }

        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: null,
        };

        database.insert("tasks", task);

        return res.writeHead(201).end();
      } catch (error) {
        console.log(error);
        return res.writeHead(400).end(
          JSON.stringify({
            data: error.toString(),
          })
        );
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      
      try {
        const { title, description } = req.body;
        if (!title) {
          throw new Error("title é obrigatorio");
        }

        if (!description) {
          throw new Error("description é obrigatorio");
        }
        database.update("tasks", id, {
          title,
          description,
        });
      } catch (error) {
        return res.writeHead(400).end(JSON.stringify({
          data: error.toString()
        }));
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      database.update("tasks", id, {
        completed_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
