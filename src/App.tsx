import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { TOOLS_LIST } from "../data/listing.ts";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";

export interface TOOL {
    id: number
    name: string
    icon: string
    description: string
    url: string
    author: string
    active: boolean
    type: string
    isFavorite?: boolean
}

interface ToolCardProps {
    tool: TOOL;
    onToggleFavorite: (id: number) => void;
    isFavorite: boolean;
}

const ToolCard: React.FC<ToolCardProps> =  ({
    tool,
    onToggleFavorite,
    isFavorite,
    }) => {
    return (
        <Card className='flex flex-col max-w-screen-lg min-w-screen-md'>
            <CardHeader className='flex-row items-center gap-2'>
                <Avatar><a href={tool.url} target='_blank'>
                    <AvatarImage src={`/icons/${tool.icon}`}/>
                    <AvatarFallback>
                        {tool.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback></a>
                </Avatar>

                <div>
                <CardTitle><a href={tool.url} target='_blank'>{tool.name}</a></CardTitle>
                        <CardDescription>
                            {tool.type.toUpperCase()}
                            {' Created by: ' + tool.author}
                        </CardDescription>
                    </div>

                    <div className='flex ml-auto'>

                        <Button variant='secondary' size='default' className='text-xl'
                                onClick={() => onToggleFavorite(tool.id)}>
                            {isFavorite ? '★' : '☆'}
                        </Button>
                        <Button size='default'><a href={tool.url} target='_blank'>GO</a></Button>
                    </div>
            </CardHeader>

            {isFavorite ? <></> : <CardContent><p>{tool.description}</p></CardContent>}
            {/*<CardContent><p>{tool.description}</p></CardContent>*/}
        </Card>
    )
}

const TOOLS: TOOL[] = TOOLS_LIST.filter(tool => tool.active)

export const App: React.FC = () => {
    // Initialize state with data from localStorage if it exists
    const [items, setItems] = useState<TOOL[]>(() => {
        const savedItems = localStorage.getItem('favoriteTools');
        return savedItems ? JSON.parse(savedItems) : TOOLS;
    });

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('favoriteTools', JSON.stringify(items));
    }, [items]);

    const toggleFavorite = (id: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? {...item, isFavorite: !item.isFavorite}
                    : item
            )
        );
    };

    const favoriteItems = items.filter(item => item.isFavorite);
    const nonFavoriteItems = items.filter(item => !item.isFavorite);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className='flex justify-end p-10 py-2'><ModeToggle></ModeToggle></div>

            <div className='flex flex-col gap-4 items-center'>

                {/*Favorites section*/}
                <div className='space-y-2 px-10'>
                    {favoriteItems.length === 0 ? (
                        <p className='text-accent-foreground text-center'>Favorite items to bring them to the top!</p>
                    ) : (
                        favoriteItems.map(app => (
                            <ToolCard
                                key={app.id}
                                tool={app}
                                onToggleFavorite={toggleFavorite}
                                isFavorite={true}></ToolCard>
                        ))
                    )}
                </div>

                {/*All items section*/}
                <div className='space-y-2 px-10'>
                    {nonFavoriteItems.map(app => (
                            <ToolCard
                                key={app.id}
                                tool={app}
                                onToggleFavorite={toggleFavorite}
                                isFavorite={false}></ToolCard>
                        )
                    )}
                </div>
            </div>
        </ThemeProvider>
    )
}