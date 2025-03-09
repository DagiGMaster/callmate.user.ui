import React from "react";
import styled from "styled-components";

const TimeWrapper = styled.div<{ isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  transition: 0.3s;
`;

const TimeTab: React.FC<{ time: string; isActive: boolean }> = ({
  time,
  isActive,
}) => {
  return <TimeWrapper isActive={isActive}>{time}</TimeWrapper>;
};

export default TimeTab;
