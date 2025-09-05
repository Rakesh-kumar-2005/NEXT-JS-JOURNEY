import React from "react";
import { Dialog, DialogContent, DialogTitle ,DialogFooter, DialogHeader } from "./ui/dialog";
import { Crown, Zap } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { PricingTable } from "@clerk/nextjs";
import { Button } from "./ui/button";

const UpgradeModal = ({ isOpen, onClose, restrictedTool, reason }) => {
  // Premium tools...
  const getToolName = (toolId) => {
    const toolNames = {
      background: "AI Background Tools",
      ai_extender: "AI Image Extender",
      ai_edit: "AI Editor",
      projects: "More than 3 projects",
    };
    return toolNames[toolId] || "Premium Features";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-slate-800 border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-amber-500" />
            <DialogTitle className="text-2xl font-bold text-white">
              Upgrade to Pro
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {/* Restriction Message */}
          {restrictedTool && (
            <Alert className="bg-amber-500/10 border-amber-500/20">
              <Zap className="h-6 w-6 !text-amber-300" />
              <AlertDescription className="text-amber-300/80">
                <div className="font-semibold text-amber-400 mb-1">
                  {getToolName(restrictedTool)} - Pro Feature
                </div>
                {reason ||
                  `${getToolName(restrictedTool)} is only available on the Pro plan. Upgrade now to unlock this powerful feature and more.`}
              </AlertDescription>
            </Alert>
          )}
          <PricingTable
            checkoutProps={{
              appearance: {
                theme: "dark",
                elements: {
                  drawerRoot: {
                    zIndex: 6000,
                  },
                },
              },
            }}
          />
        </div>
        <DialogFooter className="justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-amber-300/70 transition-all duration-300 font-semibold
             hover:text-amber-300 border border-amber-300/40 hover:border-amber-300/70 "
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
