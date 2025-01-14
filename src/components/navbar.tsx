import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Menu, Music } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const lastFMOAuthURL = `http://www.last.fm/api/auth/?api_key=${process.env.LASTFM_API}&cb=http://localhost:3000/api/auth`;

function NavContent() {
  return (
    <>
      <Button size="lg">
        <Link href={lastFMOAuthURL} className="flex items-center space-x-2">
          <Music />
          <span>Connect Last.fm</span>
        </Link>
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
            <DrawerContent className="h-full w-10/12 rounded-none bg-secondary-foreground">
              <VisuallyHidden>
                <DrawerHeader>
                  <VisuallyHidden>
                    <DrawerTitle>Navigation drawer</DrawerTitle>
                  </VisuallyHidden>
                </DrawerHeader>
              </VisuallyHidden>
              <DrawerFooter>
                <NavContent />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
