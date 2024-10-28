"use client"

import React, { useState } from "react"
import Link from "@/components/Link"
import Header from '@/components/ui/header'
import Logo from "../../public/images/logo_drop_shadow.png"
import {
    BadgeCheck,
    Bell,
    ChevronRight,
    ChevronsUpDown,
    Folder,
    Forward,
    LogOut,
    MoreHorizontal,
    Trash2,
} from "lucide-react"

import { FaUser, FaTasks, FaCogs, FaFileCode } from "react-icons/fa";
import { GiWoodBeam } from "react-icons/gi";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
    user: {
        name: "Michelle",
        role: "Administrator",
    },
    settings: [
        {
            title: "Settings",
            url: "#",
            icon: FaCogs,
            items: [
                {
                    title: "Woods",
                    url: "/woods",
                    icon: GiWoodBeam,
                },
                {
                    title: "Labor Codes",
                    url: "/settings/notifications",
                    icon: FaFileCode,
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

export default function SidebarComponent({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/">
                                <Image
                                    src={Logo}
                                    alt='Logo'
                                    className="w-2/3 md:w-full h-auto mx-auto"
                                />
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="mx-auto">
                        <SidebarGroupLabel>Pages</SidebarGroupLabel>
                        <SidebarMenu>
                            {data.pages.map((item) => (
                                <SidebarMenuItem key={item.name} className="group-data-[collapsible=icon]:mx-auto">
                                    <div className="px-2 rounded-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href={item.url}>
                                            <div className="flex items-center gap-2 py-2">
                                                <item.icon />
                                                <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                                            </div>
                                        </Link>
                                    </div>
                                </SidebarMenuItem>
                            ))}
                            {data.settings.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    className="group/collapsible group-data-[collapsible=icon]:hidden"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title} className="h-10 rounded-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                                <div className="flex items-center gap-2">
                                                    {item.icon && <item.icon />}
                                                    <span className="text-base group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                </div>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link href={subItem.url}>
                                                                {subItem.icon && <subItem.icon />}
                                                                <span>{subItem.title}</span>
                                                            </Link>
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
                <SidebarFooter className="px-4 py-2 flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full py-2">
                            <div
                                className='focus:outline-none flex items-center justify-start group-data-[collapsible=icon]:justify-center gap-2'
                            >
                                <Avatar>
                                    <AvatarImage src="https://api.dicebear.com/9.x/identicon/svg" />
                                    <AvatarFallback className="bg-gray-200 blur-md w-full h-full" />
                                </Avatar>
                                <div className="flex flex-col justify-center items-start group-data-[collapsible=icon]:hidden">
                                    <span>Michelle</span>
                                    <span className="text-sm italics text-sidebar-secondary-foreground">
                                        Administrator
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-52 bg-white" sideOffset={16}>
                            <DropdownMenuItem>
                                <Link href='#' className="no-underline flex items-center gap-2">
                                    <LogOut />
                                    Log Out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                </header>
                <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-auto">
                    <main className="grow [&>*:first-child]:scroll-mt-16">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
