import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function NavContent() {
  return (
    <>
      <Button variant="link" className="text-secondary">
        <Link href="/login">Login</Link>
      </Button>
      <Button variant="secondary">
        <Link href="/signup">Sign up</Link>
      </Button>
    </>
  );
}

export function Navbar() {
  return (
    <header className="w-full border-b bg-secondary-foreground">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <span className="hidden font-bold sm:inline-block text-secondary">
            LastCommunity
          </span>
        </Link>
        <div className="justify-between space-x-4 hidden md:block">
          <NavContent />
        </div>
        <div className="md:hidden">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="ghost">
                <Menu className="text-secondary" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-10/12 rounded-none">
              <VisuallyHidden>
                <DrawerHeader>
                  <VisuallyHidden>
                    <DrawerTitle>Navigation drawer</DrawerTitle>
                  </VisuallyHidden>
                </DrawerHeader>
              </VisuallyHidden>
              <div className="flex flex-col">
                <NavContent />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
