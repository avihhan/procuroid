import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_BASE_URL = 'http://localhost:5000'; // change this to your API base

export interface SignUpPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface QuoteRequestPayload {
    description: string;
    orderType: string;
    productDescription: string;
    quantity: string;        // Note: currently captured as string in the form
    lowerLimit: string;      // same here
    upperLimit: string;      // same here
    deliveryDate: string;
    location: string;
    supplierSelection: 'preferred' | 'discovery';
    discoveryMode: boolean;
  }

export const signUp = async (payload: SignUpPayload) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/signup`,
    payload
  );
  return response.data;
};

export const signIn = async (payload: SignInPayload) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/signin`,
    payload
  );
  return response.data;
};

export const sendQuoteRequest = async (userId: string, payload: QuoteRequestPayload) => {
  // Get the current session token
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await axios.post(
    `${API_BASE_URL}/send-quote-request/${encodeURIComponent(userId)}`,
    payload,
    {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      withCredentials: true
    }
  );
  return response.data;
};
