import { NavLink } from '@mantine/core';
import { IconClock, IconCalendar, IconGraph } from '@tabler/icons-react';

export function Sidebar() {
    return (
        <div className='flex flex-col p-4'>
            <h1 className='text-center text-2xl mb-4 p-2 '>
                <span className='font-black text-[#E3735C]'>Task</span>
                <span className='font-light italic text-black'>Manager</span>
            </h1>
            <h2 className='font-medium text-[#E3735C]'>TRACK</h2>
            <NavLink
                href="#required-for-focus"
                label="Timer"
                active
                leftSection={<IconClock size={16} stroke={1.5} />}
            />
            <NavLink
                className='focus:bg-amber-500'
                href="#required-for-focus"
                label="Calendar"
                leftSection={<IconCalendar size={16} stroke={1.5} />}
            />
            <h2 className='font-medium text-[#E3735C]'>ANALYTICS</h2>
            <NavLink
                href="#required-for-focus"
                label="Statistics"
                leftSection={<IconGraph size={16} stroke={1.5} />}
            />
        </div>
    );
}