import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UserPlus } from "lucide-react";
import { getParties, addParty, addBill } from "@/lib/store";
import { Party } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  onBillAdded: () => void;
}

export default function AddBillForm({ onBillAdded }: Props) {
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyPhone, setNewPartyPhone] = useState("");
  const [partyDialogOpen, setPartyDialogOpen] = useState(false);

  useEffect(() => {
    setParties(getParties());
  }, []);

  const handleAddParty = () => {
    if (!newPartyName.trim()) return;
    const p = addParty(newPartyName, newPartyPhone);
    setParties(getParties());
    setSelectedPartyId(p.id);
    setNewPartyName("");
    setNewPartyPhone("");
    setPartyDialogOpen(false);
    toast.success(`Party "${p.name}" added`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const party = parties.find((p) => p.id === selectedPartyId);
    if (!party || !invoiceNumber.trim() || !amount) {
      toast.error("Please fill all required fields");
      return;
    }
    addBill({
      partyId: party.id,
      partyName: party.name,
      invoiceNumber: invoiceNumber.trim(),
      date,
      amount: parseFloat(amount),
      notes: notes.trim() || undefined,
    });
    toast.success("Bill added successfully");
    setInvoiceNumber("");
    setAmount("");
    setNotes("");
    onBillAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="party">Party Name *</Label>
          <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
            <SelectTrigger id="party">
              <SelectValue placeholder="Select a party" />
            </SelectTrigger>
            <SelectContent>
              {parties.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={partyDialogOpen} onOpenChange={setPartyDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="shrink-0">
              <UserPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Party Name *</Label>
                <Input value={newPartyName} onChange={(e) => setNewPartyName(e.target.value)} placeholder="e.g. Sharma Traders" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone (optional)</Label>
                <Input value={newPartyPhone} onChange={(e) => setNewPartyPhone(e.target.value)} placeholder="Phone number" />
              </div>
              <Button type="button" onClick={handleAddParty} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Party
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="invoice">Invoice No. *</Label>
          <Input id="invoice" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="INV-001" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount (₹) *</Label>
        <Input id="amount" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any remarks..." />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Bill
      </Button>
    </form>
  );
}
