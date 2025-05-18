
import React from "react";

interface AccountInfoProps {
  userEmail: string | null;
}

const AccountInfo = ({ userEmail }: AccountInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
      <p className="text-lg">{userEmail}</p>
    </div>
  );
};

export default AccountInfo;
