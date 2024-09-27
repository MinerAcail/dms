import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenuDemo } from "./MenuDemo";
import { useAuth } from "@/middleware/context/authContext";
import {
  CrownIcon,
  InfoIcon,
  PhoneIcon,
  PhoneIncomingIcon,
  SmileIcon,
  TagIcon,
} from "lucide-react";

export const SideNavi = () => {
  const { user } = useAuth();

  // Function to close the sheet

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className=" w-max items-center cursor-pointer justify-center rounded-md bg-background m-5 p-5 text-base text-left font-semibold" variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <NavigationMenuDemo />
        <div className=" w-max items-center cursor-pointer justify-center rounded-md bg-background m-5 p-5 text-base text-left font-extralight">
          <h3 className="flex">
            <SmileIcon size={14} className=" m-1.5 " />: {user?.name}
          </h3>
          <h3 className="flex">
            <CrownIcon size={14} className=" m-1.5 " />: {user?.types}
          </h3>
          <h3 className="flex">
            <TagIcon size={14} className=" m-1.5 " />: {user?.day}
          </h3>
          <h3 className="flex">
            <PhoneIcon size={14} className=" m-1.5 " />: {user?.phoneNumber}
          </h3>
        </div>
      </SheetContent>
    </Sheet>
  );
};
