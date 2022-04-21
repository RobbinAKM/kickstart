import React from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

const Header = () => {
  return (
    <Menu inverted style={{ marginTop: "20px" }}>
      <Link href="/">
        <Menu.Item name="home" />
      </Link>
      <Menu.Item name="campaigns" />
      <Menu.Item name="add campaigns" />
    </Menu>
  );
};

export default Header;
