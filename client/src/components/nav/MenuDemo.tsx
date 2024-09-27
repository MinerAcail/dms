import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, Navigate, useLocation } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "@/middleware/context/authContext";
import { SheetClose } from "../ui/sheet";
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

const LOG_OUT_MUTATION = gql`
  mutation LogOut {
    logOut
  }
`;
export function NavigationMenuDemo() {
  const [logOutMutation] = useMutation(LOG_OUT_MUTATION);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const Admin = user?.types === "Admin";
  const subChurch = user?.types === "subChurch";

  const Leader = user?.types === "Leader";

  const handleSignOut = async () => {
    try {
      // Call the logOutMutation to initiate the logout process
      await logOutMutation();
      // Perform the client-side logout logic, including removing the token
      logout();
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  return (
    <div>
      {isAuthenticated && user ? (
        <NavigationMenu>
          <NavigationMenuList
            className={` grid ${(Admin || subChurch) && "grid-flow-col"} gap-4`}
          >
            {(Admin || subChurch) && (
              <>
                <NavigationMenuItem>
                  <Link to={"/"}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Graph
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {!subChurch && (
                  <>
                    <NavigationMenuItem>
                      <Link to={"/dashboard/distributeRegistrations"}>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Distribution
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Create</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[250px] gap-3 p-4 ">
                          {AdminComponentInput.map((component, index) => (
                            <div key={index}>
                              <ListItem
                                title={component.title}
                                to={component.to}
                              >
                                {component.description}
                              </ListItem>
                            </div>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Tables</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[250px] gap-3 p-4 ">
                          {components.map((component, index) => (
                            <div key={index}>
                              <ListItem
                                title={component.title}
                                to={component.to}
                              >
                                {component.description}
                              </ListItem>
                            </div>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                )}

                {subChurch && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Create</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[250px] gap-3 p-4 ">
                          {subChurchComponentInput.map((component, index) => (
                            <div key={index}>
                              <ListItem
                                title={component.title}
                                to={component.to}
                              >
                                {component.description}
                              </ListItem>
                            </div>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Tables</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[250px] gap-3 p-4 ">
                          {Subcomponent.map((component, index) => (
                            <div key={index}>
                              <ListItem
                                title={component.title}
                                to={component.to}
                              >
                                {component.description}
                              </ListItem>
                            </div>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <>
                        <Link to="/subprofile">Change Profile</Link>
                      </>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  </>
                )}
              </>
            )}
            <>
              {!(Admin || subChurch) && (
                <>
                  <Dialog>
                    <SheetClose asChild>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link to="/create/members">Create Members</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </SheetClose>
                  </Dialog>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link to="/grouplist">Care Group</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {Leader && (
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to="/callerlist">Caller Members</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <>
                        <Link to="/profile">Change Profile</Link>
                      </>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={handleSignOut}
                  className={navigationMenuTriggerStyle()}
                >
                  <>
                    <Link to="/signin">Sign Out</Link>
                  </>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          </NavigationMenuList>
        </NavigationMenu>
      ) : (
        <>
          {location.pathname !== "/signin" && (
            <Button className="p-5 m-7">
              <Link to="/signin">Please sign in</Link>
            </Button>
          )}
        </>
      )}
    </div>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { to: string }
>((props, ref) => {
  // Add the ref parameter
  const { className, title, children, to, ...rest } = props;

  return (
    <Link
      to={to}
      className={cn(
        "block select-none space-y-1 rounded-md p-5 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      ref={ref} // Pass the ref to the Link component
      {...rest} // Spread the rest of the props
    >
      <div className="text-sm font-medium ">{title}</div>
      <p className="text-sm text-muted-foreground">{children}</p>
    </Link>
  );
});

ListItem.displayName = "ListItem";

const components: { title: string; to: string; description: string }[] = [
  {
    title: "Church and Member",
    to: "dashboard/tables",
    description:
      "Hierarchical table structured to show main Churche and their respective sub-Churches, along with members associated with each.",
  },
  {
    title: "Current Week Registrations",
    to: "/dashboard/tables/member/register/currentweekly",
    description: "Tables that display Leader and Care persons.",
  },
];

const Subcomponent: { title: string; to: string; description: string }[] = [
  {
    title: "Member",
    to: "dashboard/tables/members",
    description:
      "Member table structured to show members associated with each Leaders.",
  },
  {
    title: "Current Week Registrations",
    to: "/dashboard/tables/sub/member/register/currentweekly",
    description: "Tables that display Leader and Care persons.",
  },
];
const AdminComponentInput: {
  title: string;
  to: string;
  description: string;
}[] = [
  {
    title: "Sub Church",
    to: "/dashboard/create/subform",
    description: "Creating A Sub Church like NGC or TEENS.",
  },
  // ,
  // {
  //   title: "Care Person",
  //   to: "/signcareform",
  //   description: "Tables that display Leader and Care persons.",
  // },
];

const subChurchComponentInput: {
  title: string;
  to: string;
  description: string;
}[] = [
  {
    title: "Sub Branch",
    to: "/dashboard/create/subform",
    description: "Creating A Sub Branch like Media and others that not part of the Care group .",
  },
  {
    title: "Create Members by Excel",
    to: "/dashboard/create/members",
    description: "Tables that display Leader and Care persons.",
  },
];

const LeadersComponentInput: {
  title: string;
  to: string;
  description: string;
}[] = [
  {
    title: "Member",
    to: "/signcareform",
    description: "Create Leader and Care persons.",
  },
  {
    title: "Assign Leader",
    to: "/signcareform",
    description: "Create Leader and Care persons.",
  },
];
