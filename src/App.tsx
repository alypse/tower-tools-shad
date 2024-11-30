import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { TOOLS_LIST } from "../data/listing.ts";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";

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
        <Card className='flex flex-col max-w-screen-sm'>
            <CardHeader className='flex-row gap-4'>
                <div className='flex gap-4'>
                    <Avatar>
                        <AvatarImage src={`/icons/${tool.icon}`}/>
                        <AvatarFallback>
                            {tool.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{tool.name}</CardTitle>
                        <CardDescription>{tool.author}</CardDescription>
                    </div>
                    <div className='flex'>
                        <Button size='default'><a href={tool.url} target='_blank'>GO</a></Button>
                        <Button variant='secondary' size='default' onClick={() => onToggleFavorite(tool.id)}>
                            {isFavorite ? '★' : '☆'}
                        </Button>
                    </div>
                </div>
                {/*{tool.type === 'app' ?*/}
                {/*    <Badge variant='outline'>{tool.type.toUpperCase()}</Badge>*/}
                {/*    : <Badge variant='outline'>{tool.type.toUpperCase()}</Badge>}*/}
            </CardHeader>
            <CardContent>
                <p>{tool.description}</p>
            </CardContent>
            <CardFooter className='flex justify-between'>
            </CardFooter>
        </Card>
    )
}

const TOOLS: TOOL[] = TOOLS_LIST.filter(tool => tool.active)

export const App: React.FC = () => {
    const [items, setItems] = useState<TOOL[]>(TOOLS);

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
                <h3 className='text-3xl font-bold px-10'>Your Favorites</h3>
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
                <h3 className='text-3xl font-bold px-10'>Tools</h3>
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