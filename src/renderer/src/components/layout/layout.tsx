import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '../sidebar/sidebar';

export function Layout() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            layout='alt'
            padding="md"
            header={{ height: 60, offset: false }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
        >
            <AppShell.Navbar>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Sidebar />
            </AppShell.Navbar>

            <AppShell.Main >Main</AppShell.Main>
        </AppShell>
    );
}