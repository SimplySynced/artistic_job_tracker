"use client"

import * as React from "react"
import Image from "next/image"
import Logo from "../../public/images/logo_drop_shadow.png"
import { FaUser, FaTasks, FaCogs, FaFileCode, FaBuilding } from "react-icons/fa";
import { GiWoodBeam } from "react-icons/gi";
import {
    ChevronRight,
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
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
import { Button } from "./ui/button";

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

export default function SidebarComponent({ children }: any) {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <div className="flex px-2 justify-center items-center gap-2">
                    <div className="flex aspect-square w-full h-auto items-center justify-center rounded-lg text-sidebar-primary-foreground">
                        <Link href='/'>
                            <Image
                                src={Logo}
                                alt='Logo'
                                className="w-auto h-auto mx-auto"
                            />
                        </Link>
                    </div>
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
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={data.user.avatar}
                                                alt={data.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {data.user.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {data.user.email}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem>
                                        <div className="w-full">
                                            <Link href="#">
                                                <Button variant="ghost" className="flex w-full justify-start items-center gap-2">
                                                    <LogOut />
                                                    Log out
                                                </Button>
                                            </Link>
                                        </div>
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
                        {children}
                    </div>
                    <div className="flex-1 rounded-xl bg-muted/50" />
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
