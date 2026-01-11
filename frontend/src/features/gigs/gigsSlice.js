import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export const fetchGigs = createAsyncThunk('gigs/fetch', async (q, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/gigs', { params: q ? { q } : {} });
    return data.gigs;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to load gigs');
  }
});

export const createGig = createAsyncThunk('gigs/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/gigs', payload);
    return data.gig;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to create gig');
  }
});

const gigsSlice = createSlice({
  name: 'gigs',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addMatcher((a) => a.type.startsWith('gigs/') && a.type.endsWith('/rejected'), (state, action) => {
        state.error = action.payload;
      });
  }
});

export default gigsSlice.reducer;
