"use server";
import { validateRequest } from "@/auth/validate-request";
import Link from "next/link";
import { LogoutButton } from "./(login)/login/components/logout-button";

export default async function Home() {
    const { user } = await validateRequest();
    return (
        <>
            <main className="container">
                <h1>Home</h1>
                {user ? (
                    <div>
                        <p>Welcome, {user.username}!</p>
                        <LogoutButton />
                    </div>
                ) : (
                    <div>
                        <p>You are not signed in.</p>
                        <Link href="/login">Log in</Link>
                        <Link href="/sign-up">Create account</Link>
                    </div>
                )}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </>
    );
}
