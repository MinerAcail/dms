
import * as React from "react";
// import Link from "next/link"

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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "@/middleware/context/authContext";


const LOG_OUT_MUTATION = gql`
  mutation LogOut {
    logOut
  }
`;
export function NavigationMenuDemo1() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const subLeader = user?.login?.types === "SubLeader";
  const Caller = user?.login?.types === "Caller";
  const [logOutMutation] = useMutation(LOG_OUT_MUTATION);

  const handleSignOut = async () => {
    try {
      // Call the logOutMutation to initiate the logout process
      await logOutMutation();
      // Perform the client-side logout logic, including removing the token
      logout();
      // navigate("/signin");
      
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };
  // if (!user){
  //   <Navigate to={"/signin"} />
  //  }
  

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {user ? (
            <>
              {!subLeader && (
                <>
                  {!Caller ? (
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

                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Tables</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 ">
                            {components.map((component,index) => (
                              <ListItem
                                key={index}
                                title={component.title}
                                to={component.to}
                              >
                                {component.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </>
                  ) : (
                    <>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          <>
                            <Link to="/calllist"> Call Members</Link>
                          </>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </>
                  )}
                </>
              )}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Create</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[250px] gap-3 p-4 ">
                    {componentInput.map((component,index) => (
                      <div  key={index}>
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

              {/* EveryOne */}
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <>
                    <Link to={"/grouplist"}> Care Group Members</Link>
                  </>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={handleSignOut}
                  className={navigationMenuTriggerStyle()}
                >
                  <>
                    <div> Sign Out</div>
                  </>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link to="/signin">Sign In</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </>
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
      <p className="text-sm  text-muted-foreground">{children}</p>
    </Link>
  );
});

ListItem.displayName = "ListItem";

const components: { title: string; to: string; description: string }[] = [
  {
    title: "Leader and Care",
    to: "/dashboard/formtable",
    description: "Tables that display Leader and Care persons.",
  },
  {
    title: "Current Week Registrations",
    to: "/dashboard/formtable/students/register/currentweekly",
    description: "Tables that display Leader and Care persons.",
  },
];
const componentInput: { title: string; to: string; description: string }[] = [
  {
    title: "Leader",
    to: "/dashboard/form/subform",
    description: "Tables that display Leader and Care persons.",
  },
  {
    title: "Care Person",
    to: "/signcareform",
    description: "Tables that display Leader and Care persons.",
  },
];
