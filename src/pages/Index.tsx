import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import AddBillForm from "@/components/AddBillForm";
import Dashboard from "@/components/Dashboard";
import { getBills } from "@/lib/store";
import { Bill } from "@/lib/types";

export default function Index() {
  const [bills, setBills] = useState<Bill[]>(getBills);
  const [tab, setTab] = useState("dashboard");

  const refresh = useCallback(() => setBills(getBills()), []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl py-4">
          <h1 className="text-xl font-bold tracking-tight">Bill Tracker</h1>
          <p className="text-sm text-muted-foreground">Manage your dealer bills simply</p>
        </div>
      </header>

      <main className="container max-w-2xl py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="dashboard" className="flex-1 gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="add" className="flex-1 gap-2">
              <PlusCircle className="h-4 w-4" /> Add Bill
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard bills={bills} onUpdate={refresh} />
          </TabsContent>

          <TabsContent value="add">
            <AddBillForm onBillAdded={() => { refresh(); setTab("dashboard"); }} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
