"use client";
import { logout } from "../logout-action";

export function LogoutButton() {
    return <button onClick={() => logout()}>Log out</button>;
}
