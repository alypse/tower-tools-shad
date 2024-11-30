import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { TOOLS_LIST } from "../data/listing.ts";

import { ToolCard } from "@/components/tool-card.tsx";

interface TOOL {
    id: number
    name: string
    icon: string
    description: string
    url: string
    author: string
    active: boolean
    isFavorite?: boolean
}


const TOOLS: TOOL[] = TOOLS_LIST.filter(tool => tool.active)

export default function App() {
    // const [apps, setApps] = useState<APP[]>([])
    // const [guides, setGuides] = useState<GUIDE[]>([])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> <ModeToggle></ModeToggle>
            <div className='grid grid-cols-4 gap-2 p-20'>
                {TOOLS.map(app => (
                    <ToolCard key={app.id} tool={app}></ToolCard>
                ))}
            </div>
        </ThemeProvider>
    )
}


