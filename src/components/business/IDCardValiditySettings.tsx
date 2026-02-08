import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/use-tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { format, isPast, isValid, parseISO } from "date-fns";

interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  level: string;
  id_card_expiry_date: string | null;
}

export default function IDCardValiditySettings() {
  const { data: tenantData } = useTenant();
  const queryClient = useQueryClient();
  const [editingDates, setEditingDates] = useState<Record<string, string>>({});

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['school_classes_with_expiry', tenantData?.tenantId],
    enabled: !!tenantData?.tenantId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_classes')
        .select('id, name, grade, level, id_card_expiry_date')
        .eq('tenant_id', tenantData!.tenantId)
        .order('name');
      if (error) throw error;
      return data as SchoolClass[];
    },
  });

  const updateExpiryMutation = useMutation({
    mutationFn: async ({ classId, expiryDate }: { classId: string; expiryDate: string | null }) => {
      const { error } = await supabase
        .from('school_classes')
        .update({ id_card_expiry_date: expiryDate })
        .eq('id', classId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Card expiry date updated");
      queryClient.invalidateQueries({ queryKey: ['school_classes_with_expiry'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates: { classId: string; expiryDate: string | null }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('school_classes')
          .update({ id_card_expiry_date: update.expiryDate })
          .eq('id', update.classId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("All expiry dates saved");
      queryClient.invalidateQueries({ queryKey: ['school_classes_with_expiry'] });
      setEditingDates({});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDateChange = (classId: string, date: string) => {
    setEditingDates(prev => ({ ...prev, [classId]: date }));
  };

  const handleSaveAll = () => {
    const updates = Object.entries(editingDates).map(([classId, date]) => ({
      classId,
      expiryDate: date || null,
    }));
    if (updates.length === 0) {
      toast.info("No changes to save");
      return;
    }
    bulkUpdateMutation.mutate(updates);
  };

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: 'none', label: 'No expiry set' };
    const date = parseISO(expiryDate);
    if (!isValid(date)) return { status: 'none', label: 'Invalid date' };
    if (isPast(date)) return { status: 'expired', label: 'Expired' };
    return { status: 'valid', label: `Valid until ${format(date, 'MMM d, yyyy')}` };
  };

  const hasChanges = Object.keys(editingDates).length > 0;

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading classes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              ID Card Validity Settings
            </CardTitle>
            <CardDescription>
              Set expiration dates for student ID cards by class. Cards become invalid after the expiry date.
            </CardDescription>
          </div>
          {hasChanges && (
            <Button onClick={handleSaveAll} disabled={bulkUpdateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No classes found. Add classes first to set ID card validity.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map(cls => {
                  const currentValue = editingDates[cls.id] ?? cls.id_card_expiry_date ?? '';
                  const status = getExpiryStatus(cls.id_card_expiry_date);
                  
                  return (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell className="capitalize">{cls.level}</TableCell>
                      <TableCell>
                        <Badge variant={
                          status.status === 'expired' ? 'destructive' : 
                          status.status === 'valid' ? 'default' : 'secondary'
                        }>
                          {status.status === 'expired' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {status.status === 'valid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={currentValue}
                          onChange={(e) => handleDateChange(cls.id, e.target.value)}
                          className="w-[160px]"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">How ID Card Validity Works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Students with <strong>expired</strong> cards will be blocked at gate check-in</li>
            <li>Students who have <strong>left the school</strong> (inactive) will also be blocked</li>
            <li>Cards without an expiry date are always valid</li>
            <li>Update expiry dates each term/year as needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
