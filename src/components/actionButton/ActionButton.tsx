import React from "react";

interface ActionButtonsProps {
  children: React.ReactNode;
}

function ActionButtons({ children }: ActionButtonsProps) {
  return <div className="flex gap-3 items-center">{children}</div>;
}

export default ActionButtons;
