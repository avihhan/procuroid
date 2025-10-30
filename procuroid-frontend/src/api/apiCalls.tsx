import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/'; // change this to your API base

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

export const sendQuoteRequest = async (userId: string, payload: QuoteRequestPayload) => {
  const response = await axios.post(
    `${API_BASE_URL}/send-quote-request/${encodeURIComponent(userId)}`,
    payload,
    { withCredentials: true }
  );
  return response.data;
};
