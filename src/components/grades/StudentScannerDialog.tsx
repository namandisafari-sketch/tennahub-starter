import { useState, useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScanLine, X, Camera, AlertCircle, Keyboard, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StudentScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onStudentFound: (student: {
    id: string;
    full_name: string;
    admission_number: string;
    class_name?: string;
    photo_url?: string;
  }) => void;
}

export function StudentScannerDialog({
  isOpen,
  onClose,
  tenantId,
  onStudentFound,
}: StudentScannerDialogProps) {
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen && mode === "scan" && !scannerRef.current) {
      initScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen, mode]);

  const initScanner = async () => {
    try {
      setError(null);
      const scannerId = "student-scanner-container";

      await new Promise((resolve) => setTimeout(resolve, 100));

      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.5,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Ignore scan errors
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Scanner init error:", err);
      setError(err.message || "Failed to initialize camera");
      setIsScanning(false);
      // Auto-switch to manual mode on camera failure
      setMode("manual");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanSuccess = async (value: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    await lookupStudent(value.replace(/^(STU:|ADM:)/, ""));
  };

  const lookupStudent = async (searchValue: string) => {
    if (!searchValue.trim()) {
      toast.error("Please enter an admission number");
      return;
    }

    setIsSearching(true);
    try {
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select(
          `
          id,
          full_name,
          admission_number,
          photo_url,
          school_classes!class_id (name)
        `
        )
        .eq("tenant_id", tenantId)
        .or(`admission_number.ilike.%${searchValue}%,full_name.ilike.%${searchValue}%`)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (studentError) throw studentError;

      if (!student) {
        toast.error("Student not found", {
          description: `No student found with "${searchValue}"`,
        });
        return;
      }

      toast.success(`Found: ${student.full_name}`);
      onStudentFound({
        id: student.id,
        full_name: student.full_name,
        admission_number: student.admission_number || "",
        class_name: student.school_classes?.name,
        photo_url: student.photo_url,
      });
      handleClose();
    } catch (err: any) {
      toast.error("Lookup failed", { description: err.message });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = async () => {
    await stopScanner();
    setManualInput("");
    setError(null);
    onClose();
  };

  const handleModeSwitch = async (newMode: "scan" | "manual") => {
    if (newMode === "manual" && mode === "scan") {
      await stopScanner();
    }
    setMode(newMode);
    if (newMode === "scan") {
      setTimeout(() => initScanner(), 100);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupStudent(manualInput.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            Quick Student Lookup
          </DialogTitle>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="px-4 flex gap-2">
          <Button
            variant={mode === "scan" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeSwitch("scan")}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            Scan
          </Button>
          <Button
            variant={mode === "manual" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeSwitch("manual")}
            className="flex-1"
          >
            <Keyboard className="h-4 w-4 mr-2" />
            Type
          </Button>
        </div>

        {mode === "scan" ? (
          <div className="relative bg-black mt-2">
            <div
              id="student-scanner-container"
              className="w-full aspect-[4/3]"
            />

            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-scan" />
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button
                  onClick={() => handleModeSwitch("manual")}
                  variant="outline"
                  size="sm"
                >
                  <Keyboard className="h-4 w-4 mr-2" />
                  Enter Manually
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admission-number">
                Admission Number or Name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="admission-number"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. 2024/001 or John"
                  autoFocus
                  disabled={isSearching}
                />
                <Button type="submit" disabled={isSearching || !manualInput.trim()}>
                  {isSearching ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the student's admission number or name to find them quickly
            </p>
          </form>
        )}

        <div className="p-4 pt-2 flex flex-col gap-2">
          {mode === "scan" && (
            <p className="text-xs text-muted-foreground text-center">
              Point camera at student ID card barcode/QR
            </p>
          )}
          <Button variant="outline" onClick={handleClose} className="w-full">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
