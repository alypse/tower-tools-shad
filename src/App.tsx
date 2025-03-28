import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { TOOLS_LIST } from "../data/listing.ts";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";

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

interface VersionedData {
    version: string;
    toolsHash?: string;
    data: TOOL[];
    layout?: string;
}

interface ToolCardProps {
    tool: TOOL;
    onToggleFavorite: (id: number) => void;
    isFavorite: boolean;
}

// Layout options
type LayoutType = "single" | "double" | "flex";

const ToolCard: React.FC<ToolCardProps> =  ({
                                                tool,
                                                onToggleFavorite,
                                                isFavorite,
                                            }) => {
    return (
        <Card className='flex flex-col max-w-screen-lg min-w-screen-lg'>
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
        </Card>
    )
}

// Define the current data version
const CURRENT_VERSION = "26.1.0";

// Create a hash of the tools data to detect changes
const createToolsHash = (tools: TOOL[]): string => {
    // Create a string representation of the tools without the isFavorite property
    const toolsString = JSON.stringify(tools.map(tool => {
        const { isFavorite, ...rest } = tool;
        return rest;
    }));

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < toolsString.length; i++) {
        const char = toolsString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
};

// Layout toggle component with text instead of icons
const LayoutToggle: React.FC<{
    currentLayout: LayoutType;
    onLayoutChange: (layout: LayoutType) => void;
}> = ({ currentLayout, onLayoutChange }) => {
    // Get display text for current layout
    const getLayoutDisplayText = () => {
        switch (currentLayout) {
            case "double": return "2 Col";
            case "flex": return "Grid";
            case "single": return "1 Col";
            default: return "Layout";
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    {getLayoutDisplayText()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onLayoutChange("single")}>
                    Single Column
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLayoutChange("double")}>
                    Two Columns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLayoutChange("flex")}>
                    Grid
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const App: React.FC = () => {
    // Filter active tools
    const activeTools = useMemo(() => TOOLS_LIST.filter(tool => tool.active), []);

    // Calculate tools hash - will update if TOOLS_LIST changes
    const toolsHash = useMemo(() => createToolsHash(activeTools), [activeTools]);

    // Layout state
    const [layout, setLayout] = useState<LayoutType>(() => {
        const savedData = localStorage.getItem('toolsData');
        if (savedData) {
            try {
                const parsedData: VersionedData = JSON.parse(savedData);
                if (parsedData.layout && ["single", "double", "flex"].includes(parsedData.layout)) {
                    return parsedData.layout as LayoutType;
                }
            } catch (e) {
                console.error("Error parsing layout data:", e);
            }
        }
        return "single"; // Default layout
    });

    // Initialize state with data from localStorage if it exists
    const [items, setItems] = useState<TOOL[]>(() => {
        const savedData = localStorage.getItem('toolsData');
        if (savedData) {
            try {
                const parsedData: VersionedData = JSON.parse(savedData);

                // Check if the saved data has a version
                if (parsedData.version && parsedData.data) {
                    // Check both version and tools hash
                    if (parsedData.version === CURRENT_VERSION &&
                        parsedData.toolsHash === toolsHash) {
                        return parsedData.data;
                    } else {
                        // Version or tools data changed - reset with preserved favorites
                        console.log(`Data changed. Updating from ${parsedData.version} to ${CURRENT_VERSION}`);
                        console.log(`Tools hash changed: ${parsedData.toolsHash} → ${toolsHash}`);

                        // Create a map of favorite status by tool ID
                        const favoritesMap = new Map(
                            parsedData.data
                                .filter(tool => tool.isFavorite)
                                .map(tool => [tool.id, true])
                        );

                        // Apply favorites to new tools data where IDs match
                        return activeTools.map(tool => ({
                            ...tool,
                            isFavorite: favoritesMap.has(tool.id)
                        }));
                    }
                }
                // Legacy format (no version) - assume it's just an array of tools
                return Array.isArray(parsedData) ? parsedData : activeTools;
            } catch (e) {
                console.error("Error parsing saved tools data:", e);
                return activeTools;
            }
        }
        return activeTools;
    });

    // Effect to update items when tools data changes
    useEffect(() => {
        const savedData = localStorage.getItem('toolsData');
        if (savedData) {
            try {
                const parsedData: VersionedData = JSON.parse(savedData);

                // If hash changed, we need to update the data
                if (parsedData.toolsHash !== toolsHash || parsedData.version !== CURRENT_VERSION) {
                    // Create a map of favorite status by tool ID
                    const favoritesMap = new Map(
                        parsedData.data
                            .filter(tool => tool.isFavorite)
                            .map(tool => [tool.id, true])
                    );

                    // Apply favorites to new tools data where IDs match
                    setItems(activeTools.map(tool => ({
                        ...tool,
                        isFavorite: favoritesMap.has(tool.id)
                    })));
                }
            } catch (e) {
                console.error("Error checking for tools updates:", e);
            }
        }
    }, [activeTools, toolsHash]);

    // Save to localStorage whenever items or layout change
    useEffect(() => {
        const versionedData: VersionedData = {
            version: CURRENT_VERSION,
            toolsHash: toolsHash,
            data: items,
            layout: layout
        };
        localStorage.setItem('toolsData', JSON.stringify(versionedData));
    }, [items, toolsHash, layout]);

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

    // Get layout classes based on current layout
    const getLayoutClasses = () => {
        switch (layout) {
            case "double":
                return "grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-10";
            case "flex":
                return "flex flex-wrap justify-center gap-4 px-4 md:px-20 lg:px-32";
            case "single":
            default:
                return "space-y-2 px-4 md:px-10 max-w-screen-lg mx-auto";
        }
    };

    // Get card classes based on current layout
    const getCardContainerClasses = () => {
        switch (layout) {
            case "double":
                return "";
            case "flex":
                return "w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)]";
            case "single":
            default:
                return "";
        }
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className='flex justify-end items-center gap-2 p-4 md:p-10 md:py-2'>
                <LayoutToggle currentLayout={layout} onLayoutChange={setLayout} />
                <ModeToggle />
            </div>

            <div className='flex flex-col gap-4 items-center'>
                {/* Favorites section */}
                {favoriteItems.length > 0 && (
                    <div className={getLayoutClasses()}>
                        {favoriteItems.map(app => (
                            <div key={app.id} className={getCardContainerClasses()}>
                                <ToolCard
                                    tool={app}
                                    onToggleFavorite={toggleFavorite}
                                    isFavorite={true} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Message when no favorites */}
                {favoriteItems.length === 0 && (
                    <p className='text-accent-foreground text-center mb-4'>
                        Favorite items to bring them to the top!
                    </p>
                )}

                {/* All items section */}
                <div className={getLayoutClasses()}>
                    {nonFavoriteItems.map(app => (
                        <div key={app.id} className={getCardContainerClasses()}>
                            <ToolCard
                                tool={app}
                                onToggleFavorite={toggleFavorite}
                                isFavorite={false} />
                        </div>
                    ))}
                </div>
            </div>
        </ThemeProvider>
    )
}
