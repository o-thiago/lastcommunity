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
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InnerNavProps = {
  lastFMSession: RequestCookie | undefined;
};

function IconLabeledSpan({ Icon, text }: { Icon: ReactNode; text: string }) {
  return (
    <>
      {Icon}
      <span>{text}</span>
    </>
  );
}

function NavContent({ lastFMSession }: InnerNavProps) {
  return (
    <>
      {lastFMSession ? (
        <form action={"/api/auth/logout"} className="w-full" method="post">
          <Button type="submit" className="w-full">
            <IconLabeledSpan Icon={<Music />} text="Logout" />
          </Button>
        </form>
      ) : (
        <Button asChild>
          <Link href={"/api/auth/login"}>
            <IconLabeledSpan text="Login with Last.fm" Icon={<Music />} />
          </Link>
        </Button>
      )}
    </>
  );
}

const UserIcon = async ({ lastFMSession }: InnerNavProps) => {
  return <>{lastFMSession && <VerifiedIcon />}</>;
};

type NavDrawerLinkProps = {
  displayName: string;
  href: string;
  highlight?: boolean;
  requiresAuth?: boolean;
  smallDeviceOnly?: boolean;
};

const NavDrawerLink = ({
  displayName,
  href,
  highlight,
  requiresAuth,
  lastFMSession,
}: NavDrawerLinkProps & InnerNavProps) => {
  return (
    <div>
      {((requiresAuth && lastFMSession) || !requiresAuth) && (
        <Link href={href}>
          <div className="text-start p-4 hover:bg-secondary/10">
            <span className={cn(highlight && "text-yellow-400")}>
              {displayName}
            </span>
          </div>
          <Separator />
        </Link>
      )}
    </div>
  );
};

export async function Navbar() {
  const cookieStore = await cookies();
  const innerNavProps: InnerNavProps = {
    lastFMSession: cookieStore.get("session"),
  };

  const authenticatedMenus: NavDrawerLinkProps[] = [
    {
      displayName: "Settings",
      href: "settings",
      requiresAuth: true,
    },
  ];

  const generalMenus: NavDrawerLinkProps[] = [
    {
      displayName: "Donate",
      href: "donate",
      highlight: true,
    },
    { displayName: "Home", href: "", smallDeviceOnly: true },
  ];

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
              <UserIcon {...innerNavProps} />
            </div>
            <DrawerContent className="h-full w-10/12 rounded-none bg-secondary-foreground">
              <DrawerHeader>
                <VisuallyHidden>
                  <DrawerTitle>Navigation drawer</DrawerTitle>
                </VisuallyHidden>
                <ul className="text-secondary">
                  {generalMenus.map(({ ...props }) => (
                    <li key={props.href}>
                      <NavDrawerLink {...props} {...innerNavProps} />
                    </li>
                  ))}
                  {authenticatedMenus.map(({ ...props }) => (
                    <li key={props.href}>
                      <NavDrawerLink {...props} {...innerNavProps} />
                    </li>
                  ))}
                </ul>
              </DrawerHeader>
              <DrawerFooter>
                <NavContent {...innerNavProps} />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <Link href="/" className="flex ">
          <span className="font-bold text-secondary">LastCommunity</span>
        </Link>
        <div className="space-x-4 hidden md:flex">
          {[...generalMenus, ...authenticatedMenus].map(
            ({ href, highlight, displayName, smallDeviceOnly }) =>
              !smallDeviceOnly && (
                <Button
                  variant="ghost"
                  className="hover:bg-secondary/10"
                  key={href}
                  asChild
                >
                  <Link href={href}>
                    <span
                      className={cn(
                        "text-secondary",
                        highlight && "text-yellow-400",
                      )}
                    >
                      {displayName}
                    </span>
                  </Link>
                </Button>
              ),
          )}
          <NavContent {...innerNavProps} />
        </div>
      </div>
    </header>
  );
}
