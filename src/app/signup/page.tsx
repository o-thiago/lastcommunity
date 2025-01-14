import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";

export default function SignUp() {
  return (
    <div className="h-full w-full flex justify-center">
      <div className="flex flex-col p-16 w-full max-w-2xl space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Register yourself!
          </h1>
          <Progress value={10} />
        </div>
        <div className="flex justify-center">
          <Button size="lg">Connect Last.fm</Button>
        </div>
      </div>
    </div>
  );
}
