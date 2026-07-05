import React from "react";

interface ActionButtonsProps {
  children: React.ReactNode;
  style?: string;
}

function ActionButtons({ children, style }: ActionButtonsProps) {
  return <div className={`flex gap-3 items-center ${style}`}>{children}</div>;
}

export default ActionButtons;
