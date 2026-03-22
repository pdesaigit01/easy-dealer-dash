import { Party, Bill } from "./types";

const PARTIES_KEY = "shop_parties";
const BILLS_KEY = "shop_bills";

export function getParties(): Party[] {
  const data = localStorage.getItem(PARTIES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveParties(parties: Party[]) {
  localStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
}

export function addParty(name: string, phone?: string): Party {
  const parties = getParties();
  const party: Party = {
    id: crypto.randomUUID(),
    name: name.trim(),
    phone: phone?.trim(),
    createdAt: new Date().toISOString(),
  };
  parties.push(party);
  saveParties(parties);
  return party;
}

export function getBills(): Bill[] {
  const data = localStorage.getItem(BILLS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBills(bills: Bill[]) {
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
}

export function addBill(bill: Omit<Bill, "id" | "isPaid">): Bill {
  const bills = getBills();
  const newBill: Bill = { ...bill, id: crypto.randomUUID(), isPaid: false };
  bills.push(newBill);
  saveBills(bills);
  return newBill;
}

export function markBillPaid(billId: string) {
  const bills = getBills();
  const idx = bills.findIndex((b) => b.id === billId);
  if (idx !== -1) {
    bills[idx].isPaid = true;
    bills[idx].paidAt = new Date().toISOString();
    saveBills(bills);
  }
}

export function deleteBill(billId: string) {
  const bills = getBills().filter((b) => b.id !== billId);
  saveBills(bills);
}
