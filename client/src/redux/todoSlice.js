import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchTodos = createAsyncThunk('todos/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/todos');
    return data;
  } catch (err) { return rejectWithValue(err.response.data); }
});

export const addTodo = createAsyncThunk('todos/add', async (todo, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/todos', todo);
    return data;
  } catch (err) { return rejectWithValue(err.response.data); }
});

export const deleteTodo = createAsyncThunk('todos/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/todos/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response.data); }
});

export const updateTodoStatus = createAsyncThunk('todos/updateStatus', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/todos/${id}/status`);
    return data;
  } catch (err) { return rejectWithValue(err.response.data); }
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.loading = true; })
      .addCase(fetchTodos.fulfilled, (state, action) => { state.items = action.payload; state.loading = false; })
      .addCase(addTodo.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      .addCase(updateTodoStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default todoSlice.reducer;