import { useState, useMemo } from "react";
import { Bill } from "@/lib/types";
import { markBillPaid, deleteBill } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Search, IndianRupee, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  bills: Bill[];
  onUpdate: () => void;
}

export default function Dashboard({ bills, onUpdate }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "due" | "paid">("all");

  const filtered = useMemo(() => {
    let list = bills;
    if (filter === "due") list = list.filter((b) => !b.isPaid);
    if (filter === "paid") list = list.filter((b) => b.isPaid);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.partyName.toLowerCase().includes(q) || b.invoiceNumber.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bills, filter, search]);

  const totalDue = bills.filter((b) => !b.isPaid).reduce((s, b) => s + b.amount, 0);
  const totalPaid = bills.filter((b) => b.isPaid).reduce((s, b) => s + b.amount, 0);
  const dueCount = bills.filter((b) => !b.isPaid).length;

  const handlePaid = (id: string) => {
    markBillPaid(id);
    toast.success("Marked as paid");
    onUpdate();
  };

  const handleDelete = (id: string) => {
    deleteBill(id);
    toast.success("Bill deleted");
    onUpdate();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<AlertCircle className="h-4 w-4 text-due" />} label="Total Due" value={`₹${totalDue.toLocaleString("en-IN")}`} accent="due" />
        <StatCard icon={<CheckCircle2 className="h-4 w-4 text-success" />} label="Total Paid" value={`₹${totalPaid.toLocaleString("en-IN")}`} accent="success" />
        <StatCard icon={<FileText className="h-4 w-4 text-primary" />} label="Pending Bills" value={String(dueCount)} accent="primary" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search party or invoice..." className="pl-9" />
        </div>
        {(["all", "due", "paid"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f}
          </Button>
        ))}
      </div>

      {/* Bills List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <IndianRupee className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No bills found</p>
          <p className="text-sm mt-1">Add your first bill to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((bill, i) => (
            <div
              key={bill.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{bill.partyName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bill.isPaid ? "bg-success/10 text-success" : "bg-due/10 text-due"}`}>
                    {bill.isPaid ? "Paid" : "Due"}
                  </span>
                </div>
                <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                  <span>#{bill.invoiceNumber}</span>
                  <span>{new Date(bill.date).toLocaleDateString("en-IN")}</span>
                </div>
                {bill.notes && <p className="text-xs text-muted-foreground mt-1">{bill.notes}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold tabular-nums">₹{bill.amount.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!bill.isPaid && (
                  <Button variant="ghost" size="icon" onClick={() => handlePaid(bill.id)} title="Mark paid" className="h-8 w-8 text-success hover:text-success">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleDelete(bill.id)} title="Delete" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="p-4 rounded-lg bg-card border shadow-sm">
      <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
      <p className="text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
