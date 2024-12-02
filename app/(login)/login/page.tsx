import SignInForm from "./sign-in-form";
import { validateRequest } from "@/auth/validate-request";
import { redirect } from "next/navigation";

export default async function Page() {
    const { user } = await validateRequest();
    if (user) {
        redirect("/list");
    }
    return (
        <>
            <main className="container mx-auto lg:px-40 px-4">
                <SignInForm />
            </main>
        </>
    );
}
