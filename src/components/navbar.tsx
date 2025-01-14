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
import { VerifiedIcon, Menu, Music } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cookies } from "next/headers";

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

const UserIcon = async () => {
  const cookieStore = await cookies();
  const lastFMToken = cookieStore.get("token");

  return <>{lastFMToken && <VerifiedIcon />}</>;
};

export async function Navbar() {
  return (
    <header className="w-full border-b bg-secondary-foreground">
      <div className="flex w-full justify-between items-center p-2">
        <div className="md:hidden">
          <Drawer direction="left">
            <div className="flex items-center space-x-2 text-secondary">
              <DrawerTrigger asChild>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </DrawerTrigger>
              <UserIcon />
            </div>
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
        <Link href="/" className="flex ">
          <span className="font-bold text-secondary">LastCommunity</span>
        </Link>
        <div className="space-x-4 hidden md:block">
          <NavContent />
        </div>
      </div>
    </header>
  );
}
