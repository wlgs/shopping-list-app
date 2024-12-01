import { validateRequest } from "@/auth/validate-request";

export async function GET() {
    const { user } = await validateRequest();
    return { user };
}
