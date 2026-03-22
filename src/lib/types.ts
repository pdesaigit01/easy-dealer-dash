export interface Party {
  id: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  partyId: string;
  partyName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  notes?: string;
  isPaid: boolean;
  paidAt?: string;
}
