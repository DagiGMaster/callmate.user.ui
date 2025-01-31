import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #0078d4;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 1.2rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Header: React.FC<{ businessName: string; avatarUrl: string }> = ({
  businessName,
  avatarUrl,
}) => {
  return (
    <HeaderWrapper>
      <HamburgerButton>☰</HamburgerButton>
      <Title>{businessName}</Title>
      <Avatar src={avatarUrl} alt="Avatar" />
    </HeaderWrapper>
  );
};

export default Header;
