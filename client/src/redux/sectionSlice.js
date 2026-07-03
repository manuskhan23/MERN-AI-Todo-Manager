import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchSections = createAsyncThunk('sections/fetch', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/sections'); return data; } catch (err) { return rejectWithValue(err.response.data); }
});

export const addSection = createAsyncThunk('sections/add', async (title, { rejectWithValue }) => {
  try { const { data } = await api.post('/sections', { title }); return data; } catch (err) { return rejectWithValue(err.response.data); }
});

export const deleteSection = createAsyncThunk('sections/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/sections/${id}`); return id; } catch (err) { return rejectWithValue(err.response.data); }
});

const sectionSlice = createSlice({
  name: 'sections',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(addSection.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.items = state.items.filter(s => s._id !== action.payload);
      });
  },
});

export default sectionSlice.reducer;