import { UnstyledButton, rem, AppShell, Stack, Tooltip } from "@mantine/core";
import {
  IconHome2,
  IconSwitchHorizontal,
  IconLogout,
} from "@tabler/icons-react";
import { useState } from "react";
import classes from "@/app/page.module.css";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconHome2, label: "Dashboard" },
  { icon: IconHome2, label: "Analytics" },
  { icon: IconHome2, label: "Releases" },
  { icon: IconHome2, label: "Account" },
  { icon: IconHome2, label: "Security" },
  { icon: IconHome2, label: "Settings" },
];

export default function Navbar() {
  const [active, setActive] = useState(0);
  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <AppShell.Navbar
      p="md"
      bg={"rgb(248, 249, 250)"}
      className={classes.navbar}
    >
      {/* <Center>
          <MantineLogo type="mark" inverted size={30} />
        </Center> */}

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </AppShell.Navbar>
  );
}
