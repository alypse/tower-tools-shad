import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar.tsx";
import { APPLIST } from "../data/listing.ts";

interface APP {
    id: number
    name: string
    icon: string
    description: string
    url: string
    author: string
    active: boolean
}

interface GUIDE {
    id: number
    name: string
    icon: string
    description: string
    url: string
    author: string
    status: string
}

const APPS: APP[] = APPLIST

// function fetchApps(): Promise<APP[]> {
//     const response =  fetch('data/listing.ts')
//     const applist =  response.json()
//     return applist.apps
// }

// async function fetchGuides(): Promise<GUIDE[]> {
//     const response = await fetch('data/listing.ts')
//     return response.json()
// }

export default function App() {
    // const [apps, setApps] = useState<APP[]>([])
    // const [guides, setGuides] = useState<GUIDE[]>([])
    return (
        <main>
            <div className='grid grid-cols-4 gap-6'>
                {APPS.map(app => (
                    <Card key={app.id} className='flex flex-col justify-between'>
                        <CardHeader className='flex-row gap-4 items-center'>
                            <Avatar>
                                <AvatarImage src={`/icons/${app.icon}`}/>
                                <AvatarFallback>
                                    {app.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{app.name}</CardTitle>
                                <CardDescription>{app.author}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{app.description}</p>
                        </CardContent>
                        <CardFooter className='flex justify-between'>
                            <Button size='lg'><a href={app.url} target='_blank'>GO</a></Button>
                            <Button variant='secondary' size='icon'>⋆</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    )
}


