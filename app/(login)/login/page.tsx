"use client";

import { login } from "./signin-action";

export default async function Page() {
    return (
        <>
            <h1>Sign in</h1>
            <form
                data-testid="login-form"
                action={(formData) => {
                    login(formData);
                }}
            >
                <label htmlFor="username">Username</label>
                <input name="username" id="username" />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <br />
                <button type="submit">Continue</button>
            </form>
        </>
    );
}
