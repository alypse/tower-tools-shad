import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { APPLIST } from "../data/listing.ts";
import { GUIDELIST } from "../data/listing.ts";
import { ToolCard } from "@/components/tool-card.tsx";

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
    active: boolean
}

const APPS: APP[] = APPLIST
const GUIDES: GUIDE[] = GUIDELIST

export default function App() {
    // const [apps, setApps] = useState<APP[]>([])
    // const [guides, setGuides] = useState<GUIDE[]>([])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> <ModeToggle></ModeToggle>
            <div className='grid grid-cols-4 gap-2 p-20'>
                {APPS.map(app => (
                    <ToolCard key={app.id} tool={app}></ToolCard>
                ))}
                {GUIDES.map(guide => (
                    <ToolCard key={guide.id} tool={guide}></ToolCard>
                ))}
            </div>
        </ThemeProvider>
    )
}


