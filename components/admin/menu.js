import {
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from "@chakra-ui/react";
import Link from "next/link";
import Router from "next/router";

export default function AdminMenu({ refresh }) {
    return (
        <Flex gap={1} mb={14}>
            <Menu autoSelect={false}>
                <MenuButton as={Button} leftIcon={<span>&equiv;</span>}>
                    Admin actions
                </MenuButton>
                <MenuList>
                    <Link href="/">
                        <MenuItem>Back home</MenuItem>
                    </Link>
                    <Link href="/admin">
                        <MenuItem>Newsletter</MenuItem>
                    </Link>
                    <Link href="/api/auth/logout">
                        <MenuItem>Log out</MenuItem>
                    </Link>
                </MenuList>
            </Menu>
            <Button onClick={refresh}>Refresh</Button>
        </Flex>
    );
}
