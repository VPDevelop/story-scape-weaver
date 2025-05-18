
import React from "react";
import { Button } from "@/components/ui/button";

const SubscriptionInfo = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Subscription</h3>
      <p className="text-muted-foreground mb-4">You are currently on the free plan.</p>
      <Button disabled className="bg-primary/80">
        Upgrade to Premium
      </Button>
    </div>
  );
};

export default SubscriptionInfo;
