"use client";

import { signup } from "./signup-action";

export default async function Page() {
    return (
        <>
            <h1>Create an account</h1>
            <form
                action={async (formData) => {
                    await signup(formData);
                }}
            >
                <label htmlFor="username">Username</label>
                <input name="username" id="username" />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <br />
                <button>Continue</button>
            </form>
        </>
    );
}
