import express, {Application, Request, Response} from "express";
import bodyParser from "body-parser";
import { db } from "./database"

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

        this.app.get("/todos", async (req: Request, res: Response): Promise<Response> => {
            const response = await db.selectFrom('todos')
                .selectAll()
                .execute()

            return res.status(200).json(response);
        });

        this.app.get("/todos/:id", async (req: Request, res: Response): Promise<Response> => {
            const id = parseInt(req.params.id);

            const response = await db.selectFrom('todos')
                .select(['description', 'done'])
                .where('id', '=', id)
                .execute()

            return res.status(200).json(response);
        });

        this.app.post("/todos", async (req: Request, res: Response) => {
            const { description } = req.body;
            const done = false;

            const response = await db
                .insertInto('todos')
                .values({
                    description: description,
                    done: done
                    })
                .executeTakeFirstOrThrow()

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
        
        this.app.put("/todos/:id", async (req: Request, res: Response): Promise<Response> => {
            const id = parseInt(req.params.id);
            const { done } = req.body;

            const response = await db
                .updateTable('todos')
                .set( { done } )
                .where('id', '=', id)
                .executeTakeFirst()

            return res.json(`Todos update Sucsessfully`);
        });

        this.app.delete("/todos/:id", async (req: Request, res: Response): Promise<Response> => {
            const id = parseInt(req.params.id);

            const response = await db
                .deleteFrom('todos')
                .where('id', '=', id)
                .executeTakeFirst()

            return res.json('Todos deleted Sucsessfully');
        });

    }
}

const port = 3000;
const app = new App().app;
app.listen(port, () => {
    console.log("Server on port " + port);
});