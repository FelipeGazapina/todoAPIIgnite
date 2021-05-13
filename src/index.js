const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
    const user = users.find(user => user.username === username)
    
    if(!user) response.status(404).json({error: "User not found"})

    request.user = user
    return next()
}

app.post('/users', (request, response) => {
  const {username} = request.headers
  const {name} = request.body

  /**
   * Testa para ver se o usuario ja existe
   */
  const userAlreadyExist = users.some(user => user.username === username)

  userAlreadyExist ? response.status(400).json({error: 'User already exist!'}) : ''

  const user = users.push({
      id: uuidv4(),
      name: name,
      username: username,
      todos: []
  })
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

    return response.status(200).json({
            message: "Todos was founded!",
            todos: user.todos 
        })
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request
        const {title, deadline} = request.body

        const newTodo = {
            id: uuidv4(),
            title,
            deadline: new Date(deadline),
            created_at: new Date(),
            status: false
        }

        user.todos.push(newTodo)

        return response.status(201).json({message:"Todo added successfully!"})
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const {user} = request
    const {id} = request.params
    const todoExist = user.todos.find(todo => todo.id === id)

    // if(!uuidValidate(id)) return response.status(400).json({error:"ID informado incorreto"})
    if(!todoExist) return response.status(404).json({error: 'Todo doesn`t exist!'})

    const {title, deadline} = request.body

    if(title) todoExist.title = title
    if(deadline) todoExist.deadline = new Date(deadline)

    return response.status(200).json({message: "Data Upgraded successfully"})
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    const {user} = request
    const {id} = request.params

    const todoExist = user.todos.find(todo => todo.id === id)

    if(!todoExist) return response.status(404).json({error: 'Todo doesn`t exist!'})
    todoExist.status = true

    return response.status(200).json({todoExist})
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    const {user} = request
    const {id} = request.params

    const todoExist = user.todos.find(todo => todo.id === id)

    if(!todoExist) return response.status(404).json({error: 'Todo doesn`t exist!'})

    user.todos.splice(id,1)
    
    return response.status(204).send()
});

module.exports = app;