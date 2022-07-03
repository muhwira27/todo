import express, {Application, Request, Response} from "express";
import bodyParser from "body-parser";
import { pool } from "./database"
import {QueryResult} from 'pg';

let data: any[] = [
    {description: "belajar", done: false},
    {description: "tidur", done: false},
    {description: "mandi", done: false}
]

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.plugins();
        this.routes();
    }

    protected plugins() {
        this.app.use(bodyParser.json());
    }

    protected routes() {

        this.app.get("/", async (req: Request, res: Response): Promise<Response> => {
            try {
                const response: QueryResult = await pool.query('SELECT * FROM todos');
                return res.status(200).json(response.rows);
            }
            catch(err) {
                console.log(err);
                return res.status(400).json('Internal server error');
            }
        });

        this.app.get("/:id", async (req: Request, res: Response): Promise<Response> => {
            const id = parseInt(req.params.id);
            const response: QueryResult = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
            return res.status(200).json(response.rows);
        });

        this.app.post("/", async (req: Request, res: Response) => {
            const { description } = req.body;
            const done = false;
            const response: QueryResult = await pool.query('INSERT INTO todos (description, done) VALUES ($1, $2)', [description, done])

            res.json({
                message: 'Todo Created Successfully',
                body: {
                    todos: {
                        description,
                        done
                    }
                }
            });
        });
        
        this.app.put("/:id", async (req: Request, res: Response): Promise<Response> => {
            const id = parseInt(req.params.id);
            const { done } = req.body;
            const response: QueryResult = await pool.query('UPDATE todos SET done = $1 WHERE id = $2', [done, id]);
            return res.json(`Todos update Sucsessfully`);
        });

        this.app.delete("/:id", async (req: Request, res: Response): Promise<Response> => {
            const id = parseInt(req.params.id);
            const response: QueryResult = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
            return res.json('Todos deleted Sucsessfully');
        });

    }
}

const port = 3000;
const app = new App().app;
app.listen(port, () => {
    console.log("Listen to port " + port);
});