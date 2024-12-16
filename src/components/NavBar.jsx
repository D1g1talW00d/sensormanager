// components/NavBar.jsx
import { Flex, Heading, Button, Menu, MenuButton, MenuItem } from "@aws-amplify/ui-react";

export default function NavBar({ signOut }) {
  return (
    <Flex
      as="nav"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      padding="1rem"
      backgroundColor="var(--amplify-colors-background-secondary)"
      width="100%"
    >
      <Flex gap="1rem" alignItems="center">
        <Heading level={3}>Sensor Manager</Heading>
      </Flex>

      {/* Desktop Navigation */}
      <Flex
        gap="1rem"
        alignItems="center"
        display={{ base: 'none', large: 'flex' }}
      >
        <Button variation="link" onClick={() => window.location.href='/'}>
          Home
        </Button>
        <Button variation="link" onClick={() => window.location.href='/sensors'}>
          Sensors
        </Button>
        <Button variation="link" onClick={() => window.location.href='/dashboard'}>
          Dashboard
        </Button>
        <Button onClick={signOut}>Sign Out</Button>
      </Flex>

      {/* Mobile Navigation */}
      <Menu
        display={{ base: 'block', large: 'none' }}
        trigger={
          <MenuButton variation="menu">Menu</MenuButton>
        }
      >
        <MenuItem onClick={() => window.location.href='/'}>Home</MenuItem>
        <MenuItem onClick={() => window.location.href='/sensors'}>Sensors</MenuItem>
        <MenuItem onClick={() => window.location.href='/dashboard'}>Dashboard</MenuItem>
        <MenuItem onClick={signOut}>Sign Out</MenuItem>
      </Menu>
    </Flex>
  );
}
