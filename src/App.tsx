import React, { FC, useReducer, useState, ChangeEvent, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

interface ITodo {
  content: string
  done: boolean
}

interface State {
    todos: ITodo[]
}

type Action = {
  type: 'SET_ALL',
  payload: State
} | {
  type: 'ADD',
  payload: ITodo
} | {
  type: 'REMOVE',
  payload: number
} | {
  type: 'EDIT',
  payload: {
    index: number,
    content: string
  }
}

const initialValue: State = {
  todos: []
}

const todosReducer = (state: State, action: Action ): State => {
  switch(action.type) {
    case 'SET_ALL': 
      return action.payload
    case 'ADD':
      return { todos: [
        ...state.todos,
        action.payload
      ]}
    case 'REMOVE':
      return { todos: [
        ...state.todos.filter((todo, i) => i !== action.payload)
      ]}
    case 'EDIT':
      return { todos: [
        ...state.todos.map((todo, i) => {
          if(i === action.payload.index){
            todo.content = action.payload.content
          }
          return todo
        })
      ]}
    default:
      throw new Error();
  }
}

type TodoProps = {
  todo: ITodo
  onRemove: any // Not figured out yet
  onChange: any // Not figured out yet
}

const styles = {
  todoInput: {
    background: 'none',
    border: 'none',
    margin: '10px 0',
    color: '#fff',
    fontWeight: 700,
    width: 'calc(100% - 60px)',
  },
  todoRemove: {
    width: '30px',
    height: '30px',
    marginLeft: '28px',
  }
}

const Todo: FC<TodoProps> = ({ todo, onRemove, onChange }) => {
  return (
    <div>
      <input
        style={styles.todoInput}
        value={todo.content}
        onChange={onChange}
      />
      <button
        style={styles.todoRemove}
        onClick={onRemove}
      >X</button>
    </div>
  )
}

const App: FC = () => {
  const [state, dispatch] = useReducer(todosReducer, initialValue)
  const [todo, setTodo] = useState('')

  useEffect(() => {
    const cache = localStorage.getItem('@myapp/todos')
    if(cache){
      dispatch({
        type: 'SET_ALL',
        payload: JSON.parse(cache)
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('@myapp/todos', JSON.stringify(state))
  }, [state])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{ display: 'flex', margin: 30 }}>
          <div>
            <strong>With Todo component</strong>
            {
              state.todos.map((todo: ITodo, i) => (
                <Todo
                  key={i}
                  todo={todo}
                  onRemove={
                    () => dispatch({
                      type: 'REMOVE',
                      payload: i
                    })
                  }
                  onChange={
                    (e: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: 'EDIT',
                        payload: {
                          index: i,
                          content: e.target.value
                        }
                      })
                    }
                  }
                />
              ))
            }
          </div>
          <div style={{ marginLeft: 15, paddingLeft: 15, borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <strong>Without Todo component</strong>
            {
              state.todos.map((todo: ITodo, i) => (
                <div key={i}>
                  <input
                    style={styles.todoInput}
                    value={todo.content}
                    onChange={
                      (e: ChangeEvent<HTMLInputElement>) => {
                        dispatch({
                          type: 'EDIT',
                          payload: {
                            index: i,
                            content: e.target.value
                          }
                        })
                      }
                    }
                  />
                  <button
                    style={styles.todoRemove}
                    onClick={
                      () => dispatch({
                        type: 'REMOVE',
                        payload: i
                      })
                    }
                  >X</button>
                </div>
              ))
            }
          </div>
        </div>
        <input
          value={todo}
          onChange={e => setTodo(e.target.value)}
          placeholder="ex. Play invoker 5th"
        />
        <button onClick={() => {
          dispatch({ type: 'ADD', payload: { content: todo, done: false } })
          setTodo('')
        }}>Add</button>
      </header>
    </div>
  );
}

export default App;
