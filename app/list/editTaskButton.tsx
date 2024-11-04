import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function EditTaskButton() {
    return (
        <>
            <Button variant="ghost">
                <Edit />
            </Button>
        </>
    );
}
