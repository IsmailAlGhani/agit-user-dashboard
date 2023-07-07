import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { User } from "../types";

type DeleteUserProp = {
  user: User;
  handleCancel: () => void;
  handleSubmit: (user: User) => void;
};

export default function DeleteUser({
  user,
  handleCancel,
  handleSubmit,
}: DeleteUserProp) {
  const { username = "" } = user || {};
  return (
    <>
      <DialogHeader>Are you sure you want to delete this user?</DialogHeader>
      <DialogBody divider>
        After doing a delete, the {username} data cannot be restored.
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="blue-gray"
          onClick={handleCancel}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={() => handleSubmit(user)}
        >
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </>
  );
}
