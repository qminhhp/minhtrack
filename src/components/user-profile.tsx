'use client'
import { UserCircle } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            // Call the sign-out API route
            const response = await fetch("/api/auth/sign-out", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Redirect to sign-in page
                router.push("/sign-in");
            } else {
                console.error("Failed to sign out");
            }
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <UserCircle className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
