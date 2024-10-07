import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    cookies().delete("auth_session");
    redirect("/");
}
