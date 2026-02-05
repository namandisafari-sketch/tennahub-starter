import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/use-tenant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ChefHat, Clock, CheckCircle, UtensilsCrossed, Timer, Bell } from "lucide-react";

interface SaleItem {
  quantity: number;
  products: { name: string } | null;
}

interface Order {
  id: string;
  order_number: number | null;
  order_type: string | null;
  order_status: string | null;
  sale_items: SaleItem[];
  created_at: string;
  total_amount: number;
  notes: string | null;
}

export default function KitchenDisplay() {
  const { data: tenantData } = useTenant();
  const tenantId = tenantData?.tenantId;
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch active orders with their items
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['kitchen-orders', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      
      const { data, error } = await supabase
        .from('sales')
        .select(`
          id, order_number, order_type, order_status, created_at, total_amount, notes,
          sale_items(quantity, products(name))
        `)
        .eq('tenant_id', tenantId)
        .in('order_status', ['pending', 'preparing'])
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return (data || []) as unknown as Order[];
    },
    enabled: !!tenantId,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Update order status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('sales')
        .update({ order_status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
      const action = variables.newStatus === 'preparing' ? 'started' : 'completed';
      toast({
        title: `Order ${action}!`,
        description: `Order status updated to ${variables.newStatus}.`,
      });
    },
  });

  const getTimeSince = (createdAt: string) => {
    const diff = Math.floor((currentTime.getTime() - new Date(createdAt).getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyClass = (createdAt: string) => {
    const mins = Math.floor((currentTime.getTime() - new Date(createdAt).getTime()) / 60000);
    if (mins >= 15) return 'border-destructive bg-destructive/10';
    if (mins >= 10) return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
    return 'border-border';
  };

  const pendingOrders = orders.filter(o => o.order_status === 'pending');
  const preparingOrders = orders.filter(o => o.order_status === 'preparing');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Kitchen Display</h1>
            <p className="text-muted-foreground">
              {orders.length} active order{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString()}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Active Orders</h3>
            <p className="text-muted-foreground text-center">
              New orders will appear here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-semibold">New Orders ({pendingOrders.length})</h2>
            </div>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className={`transition-all ${getUrgencyClass(order.created_at)}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">
                        #{order.order_number}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          <Timer className="h-3 w-3 mr-1" />
                          {getTimeSince(order.created_at)}
                        </Badge>
                        <Badge variant="secondary">
                          {order.order_type === 'dine_in' ? 'DINE IN' : 
                           order.order_type === 'takeaway' ? 'TAKEAWAY' : 'COUNTER'}
                        </Badge>
                      </div>
                    </div>
                    {order.notes && (
                      <p className="text-sm text-muted-foreground">
                        {order.notes}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-3" />
                    <div className="space-y-2 mb-4">
                      {(order.sale_items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="font-medium">
                            {item.quantity}x {item.products?.name || 'Unknown Item'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => updateStatus.mutate({ 
                        orderId: order.id, 
                        newStatus: 'preparing' 
                      })}
                      disabled={updateStatus.isPending}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Preparing
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {pendingOrders.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No new orders
                </p>
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Preparing ({preparingOrders.length})</h2>
            </div>
            <div className="space-y-4">
              {preparingOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className={`transition-all border-primary/50 bg-primary/5 ${getUrgencyClass(order.created_at)}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">
                        #{order.order_number}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          <Timer className="h-3 w-3 mr-1" />
                          {getTimeSince(order.created_at)}
                        </Badge>
                        <Badge>
                          {order.order_type === 'dine_in' ? 'DINE IN' : 
                           order.order_type === 'takeaway' ? 'TAKEAWAY' : 'COUNTER'}
                        </Badge>
                      </div>
                    </div>
                    {order.notes && (
                      <p className="text-sm text-muted-foreground">
                        {order.notes}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-3" />
                    <div className="space-y-2 mb-4">
                      {(order.sale_items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="font-medium">
                            {item.quantity}x {item.products?.name || 'Unknown Item'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full"
                      variant="default"
                      onClick={() => updateStatus.mutate({ 
                        orderId: order.id, 
                        newStatus: 'completed' 
                      })}
                      disabled={updateStatus.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Ready
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {preparingOrders.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No orders being prepared
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
