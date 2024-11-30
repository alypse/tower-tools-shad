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
        <Card className='flex flex-col justify-between'>
            <CardHeader className='flex-row gap-4 items-center justify-between'>
                <div className='flex items-center gap-4'>
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
                </div>
                {tool.type === 'app' ?
                    <Badge variant='default'>{tool.type.toUpperCase()}</Badge>
                    : <Badge variant='default'>{tool.type.toUpperCase()}</Badge>}
            </CardHeader>
            <CardContent>
                <p>{tool.description}</p>
            </CardContent>
            <CardFooter className='flex justify-between'>
                <Button size='lg'><a href={tool.url} target='_blank'>GO</a></Button>
                <Button variant='secondary' size='icon' onClick={() => onToggleFavorite(tool.id)}>
                    {isFavorite ? '★' : '☆'}
                </Button>
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

            <div className='grid grid-cols-1 gap-1 p-10'>
                <div className='flex justify-self-end'><ModeToggle></ModeToggle></div>

                {/*Favorites section*/}
                <h3 className='text-3xl font-bold'>Your Favorites</h3>
                <div className='grid-cols-2 gap-1 p-10'>
                    {favoriteItems.length === 0 ? (
                        <p className='text-accent-foreground'>Favorite items to bring them to the top!</p>
                    ) : (
                        <div>
                            {favoriteItems.map(app => (
                                <ToolCard key={app.id} tool={app} onToggleFavorite={toggleFavorite}
                                          isFavorite={true}></ToolCard>
                            ))}
                        </div>
                    )}
                </div>

                {/*All items section*/}
                <h3 className='text-3xl font-bold'>Tools</h3>
                <div className='grid grid-cols-1 gap-1 p-10'>
                    <div>
                        {nonFavoriteItems.map(app => (
                            <ToolCard key={app.id} tool={app} onToggleFavorite={toggleFavorite}
                                      isFavorite={false}></ToolCard>
                        ))}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}