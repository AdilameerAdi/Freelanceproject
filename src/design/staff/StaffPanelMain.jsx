import React, { useState } from "react";
import StaffLogin from "./StaffLogin";
import StaffPanel from "./StaffPanel";

export default function StaffPanelMain() {
  const [staffMember, setStaffMember] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (staff) => {
    setStaffMember(staff);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setStaffMember(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn || !staffMember) {
    return <StaffLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <StaffPanel staffMember={staffMember} onLogout={handleLogout} />;
}