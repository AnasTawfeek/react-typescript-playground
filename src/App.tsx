import React, { FC, useReducer, useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface Todo {
  content: string
  done: boolean
}

interface State {
    todos: Todo[]
}

type Action = {
  type: 'ADD',
  payload: Todo
} | {
  type: 'REMOVE',
  payload: number
}

const initialValue: State = {
  todos: []
}

const todosReducer = (state: State, action: Action ): State => {
  switch(action.type) {
    case 'ADD':
      return { todos: [
        ...state.todos,
        action.payload
      ]}
    case 'REMOVE':
      return { todos: [
        ...state.todos.filter((todo, i) => i !== action.payload)
      ]}
    default:
      throw new Error();
  }
}

const App: FC = () => {
  const [state, dispatch] = useReducer(todosReducer, initialValue)
  const [todo, setTodo] = useState('')
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          {
            state.todos.map((todo: Todo, i) => {
              return (
                <div key={todo.content}>
                  <strong>{todo.content}</strong>
                  <button onClick={() => dispatch({
                    type: 'REMOVE',
                    payload: i
                  })}>X</button>
                </div>
              )
            })
          }
        </div>
        <input value={todo} onChange={e => setTodo(e.target.value)} />
        <button onClick={() => {
          dispatch({ type: 'ADD', payload: { content: todo, done: false } })
          setTodo('')
        }}>Add</button>
      </header>
    </div>
  );
}

export default App;
