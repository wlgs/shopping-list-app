import { validateRequest } from "@/auth/validate-request";
import Link from "next/link";
import { LogoutButton } from "@/app/(login)/login/components/logout-button";
import { ThemeToggleButton } from "./theme-toggle-button";
import { UserRound } from "lucide-react";

export default async function Navbar() {
    const { user } = await validateRequest();
    return (
        <>
            <nav className="flex w-3/5 px-4 gap-4 h-[48px] items-center  mx-auto backdrop-blur-md z-30 fixed left-1/2 -translate-x-1/2 top-4 rounded-full">
                <Link className="mr-auto font-extrabold text-2xl " href="/">
                    toBuy
                </Link>
                <ThemeToggleButton />
                {user ? (
                    <>
                        <div className="flex flex-row items-center gap-1">
                            <UserRound size={16} />
                            {user.username}
                        </div>
                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <Link href="/sign-up">Register</Link>
                        <Link href="/login">Sign in</Link>
                    </>
                )}
            </nav>
        </>
    );
}
