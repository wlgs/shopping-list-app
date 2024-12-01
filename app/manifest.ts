import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "toBuy",
        short_name: "toBuy",
        description: "toBuy",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        icons: [
            {
                src: "/icon.webp",
                sizes: "1024x1024",
                purpose: "any",
            },
        ],
    };
}
