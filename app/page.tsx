"use server";

import { validateRequest } from "@/auth/validate-request";
import { redirect } from "next/navigation";

export default async function Home() {
    const { user } = await validateRequest();
    if (user) {
        redirect("/list");
    }
    redirect("/login");
}
