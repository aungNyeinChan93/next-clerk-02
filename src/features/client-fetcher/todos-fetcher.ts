import { SearchCheck } from "lucide-react";
import { json } from "stream/consumers"



export async function getAllTodos(page: string = '1', limit: string = '10', search: string = '') {
    const todos = await fetch(`/api/todos?page=${page}&limit=${limit}&search=${search}`).then(res => res.json())
    return todos;
}