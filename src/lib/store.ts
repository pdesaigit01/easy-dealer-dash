import { supabase } from "@/integrations/supabase/client";

export async function getParties() {
  const { data, error } = await supabase.from("parties").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function addParty(name: string, phone?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("parties")
    .insert({ name: name.trim(), phone: phone?.trim() || null, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getBills() {
  const { data, error } = await supabase.from("bills").select("*").order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addBill(bill: { party_id: string; party_name: string; invoice_number: string; date: string; amount: number; notes?: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("bills")
    .insert({ ...bill, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markBillPaid(billId: string) {
  const { error } = await supabase
    .from("bills")
    .update({ is_paid: true, paid_at: new Date().toISOString() })
    .eq("id", billId);
  if (error) throw error;
}

export async function deleteBill(billId: string) {
  const { error } = await supabase.from("bills").delete().eq("id", billId);
  if (error) throw error;
}
