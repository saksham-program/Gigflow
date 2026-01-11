import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export const createBid = createAsyncThunk('bids/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/bids', payload);
    return data.bid;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to bid');
  }
});

export const fetchBidsForGig = createAsyncThunk('bids/fetchForGig', async (gigId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/bids/${gigId}`);
    return { gig: data.gig, bids: data.bids };
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to load bids');
  }
});

export const hireBid = createAsyncThunk('bids/hire', async (bidId, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/api/bids/${bidId}/hire`);
    return data.bid;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to hire');
  }
});

const bidsSlice = createSlice({
  name: 'bids',
  initialState: { gig: null, items: [], error: null },
  reducers: {
    clearBids: (state) => {
      state.gig = null;
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.gig = action.payload.gig;
        state.items = action.payload.bids;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        const hired = action.payload;
        state.items = state.items.map((b) => {
          if (b._id === hired._id) return { ...b, status: 'hired' };
          if (b.status === 'pending') return { ...b, status: 'rejected' };
          return b;
        });
      })
      .addMatcher((a) => a.type.startsWith('bids/') && a.type.endsWith('/rejected'), (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearBids } = bidsSlice.actions;
export default bidsSlice.reducer;
