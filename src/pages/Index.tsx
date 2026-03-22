import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import AddBillForm from "@/components/AddBillForm";
import Dashboard from "@/components/Dashboard";
import { getBills } from "@/lib/store";
import { Bill } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Index() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [tab, setTab] = useState("dashboard");
  const { user, signOut } = useAuth();

  const refresh = useCallback(async () => {
    try {
      setBills(await getBills());
    } catch {
      toast.error("Failed to load bills");
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Bill Tracker</h1>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">{user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
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
