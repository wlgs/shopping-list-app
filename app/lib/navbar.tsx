import { validateRequest } from "@/auth/validate-request";
import Link from "next/link";
import { LogoutButton } from "@/app/(login)/login/components/logout-button";

export default async function Navbar() {
    const { user } = await validateRequest();
    return (
        <>
            <nav className="flex md:px-48 px-8 w-full gap-4 h-[48px] items-center border-b-[1px] border-gray-500 mx-auto backdrop-blur-md fixed left-0 top-0">
                <Link className="mr-auto font-extrabold text-2xl " href="/">
                    toBuy
                </Link>
                {user ? (
                    <>
                        <p>Hi, {user.username}!</p>
                        <Link href="/list">My list</Link>
                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <Link href="/sign-up">Register</Link>
                        <Link href="/login">Login</Link>
                    </>
                )}
            </nav>
        </>
    );
}
