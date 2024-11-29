import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";

interface APP {
    id: number
    name: string
    icon: string
    description: string
    url: string
    author: string
    active: boolean
}

export function ToolCard({tool}: { tool: APP }) {
    return (
        <Card className='flex flex-col justify-between'>
            <CardHeader className='flex-row gap-4 items-center'>
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
            </CardHeader>
            <CardContent>
                <p>{tool.description}</p>
            </CardContent>
            <CardFooter className='flex justify-between'>
                <Button size='lg'><a href={tool.url} target='_blank'>GO</a></Button>
                <Button variant='secondary' size='icon'>⋆</Button>
            </CardFooter>
        </Card>
    )
}