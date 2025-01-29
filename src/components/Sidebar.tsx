"use client"

import * as React from "react"
import Image from "next/image"
import Logo from "../../public/images/logo_drop_shadow.png"
import { FaUser, FaTasks, FaCogs, FaFileCode, FaBuilding } from "react-icons/fa";
import { GiWoodBeam } from "react-icons/gi";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "@/components/Link"
import { LuChevronRight, LuUser } from "react-icons/lu";
import { SessionProvider, signOut } from "next-auth/react";

const data = {
    user: {
        name: "Michelle",
        role: "Administrator",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    settings: [
        {
            title: "Settings",
            url: "#",
            isActive: true,
            icon: FaCogs,
            items: [
                {
                    title: "Woods",
                    url: "/woods",
                    icon: GiWoodBeam,
                },
                {
                    title: "Wood Replacement",
                    url: "/wood-replacement",
                    icon: GiWoodBeam,
                },
                {
                    title: "Labor Codes",
                    url: "/laborcodes",
                    icon: FaFileCode,
                },
                {
                    title: "Locations",
                    url: "/locations",
                    icon: FaBuilding,
                },
            ],
        },
    ],
    pages: [
        {
            name: "Employees",
            url: "/employees",
            icon: FaUser,
        },
        {
            name: "Jobs",
            url: "/jobs",
            icon: FaTasks,
        },
    ],
}

export default function SidebarComponent({ children, session }: any) {
    return (
        <SidebarProvider>
            <Sidebar>
                {/* Responsive Logo */}
                <div className="flex px-2 justify-center items-center gap-2 py-4">
                    <Link href="/">
                        <Image
                            src={Logo}
                            alt="Logo"
                            className="mx-auto"
                            width={150} // Adjust for desktop
                            height={150}
                            style={{ maxWidth: "100%", height: "auto" }} // Ensures responsiveness
                        />
                    </Link>
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Pages</SidebarGroupLabel>
                        <SidebarMenu className="space-y-1">
                            {data.pages.map((item) => (
                                <SidebarMenuItem key={item.name} className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:mx-auto">
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            {data.settings.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <LuUser />
                                        {/* Show username dynamically */}
                                        {session?.user?.name || "Guest"}
                                        <LuChevronRight className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-[--radix-popper-anchor-width]"
                                >
                                    <DropdownMenuItem>
                                        <Link href="/account">
                                            Account
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link onClick={() => signOut()} href="/">
                                            Sign Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                    <div className="w-full ">
                        <SessionProvider session={session}>
                            {children}
                        </SessionProvider>
                    </div>
                    <div className="flex-1 rounded-xl bg-muted/50" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
