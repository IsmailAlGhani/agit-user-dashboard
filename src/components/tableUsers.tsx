import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
  Dialog,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState } from "react";
import { FormType, GroupAccess, PageType, Sorting, User } from "../types";
import {
  DUMMY_USERS,
  MAX_DATA_TABLE,
  TABLE_HEAD,
  arrayPaginate,
  dateFormat,
  useDebounce,
} from "../util";
import ChevronSort from "./chevronSort";
import DeleteUser from "./deleteUser";
import FormUser from "./formUser";

export default function TableUsers() {
  const [data, setData] = useState<User[]>(DUMMY_USERS);
  const [dataManipulate, setDataManipulate] = useState<User[]>(DUMMY_USERS);
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<Sorting>({
    label: "",
    isAscend: true,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>(FormType.CREATE);
  const [userAction, setUserAction] = useState<User>();

  const handleManipulate = useCallback(
    (data: User[]) => {
      let dataTemp = [...data];

      /**
       * Search using Filter function
       */
      dataTemp = data.filter((user) => {
        const fullname = user.firstname + " " + user.lastname;
        const searchLower = search.trim().toLowerCase();
        return (
          fullname.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.groupAccess.toLowerCase().includes(searchLower) ||
          dateFormat(user.expiredDate).toLowerCase().includes(searchLower)
        );
      });

      /**
       * Sorting use switch case
       */
      switch (sorting.label) {
        case TABLE_HEAD[0]:
          dataTemp.sort((user1, user2) => {
            const fullname1 = user1.firstname + " " + user1.lastname;
            const fullname2 = user2.firstname + " " + user2.lastname;
            if (sorting.isAscend) {
              return fullname1.localeCompare(fullname2);
            }
            return fullname2.localeCompare(fullname1);
          });
          break;
        case TABLE_HEAD[1]:
          dataTemp.sort((user1, user2) => {
            if (sorting.isAscend) {
              return user1.username.localeCompare(user2.username);
            }
            return user2.username.localeCompare(user1.username);
          });
          break;
        case TABLE_HEAD[2]:
          dataTemp.sort((user1, user2) => {
            if (sorting.isAscend) {
              return user1.email.localeCompare(user2.email);
            }
            return user2.email.localeCompare(user1.email);
          });
          break;
        case TABLE_HEAD[3]:
          dataTemp.sort((user1, user2) => {
            if (sorting.isAscend) {
              return user1.groupAccess.localeCompare(user2.groupAccess);
            }
            return user2.groupAccess.localeCompare(user1.groupAccess);
          });
          break;
        case TABLE_HEAD[4]:
          dataTemp.sort((user1, user2) => {
            if (sorting.isAscend) {
              return user1.expiredDate.valueOf() - user2.expiredDate.valueOf();
            }
            return user2.expiredDate.valueOf() - user1.expiredDate.valueOf();
          });
          break;
        default:
          break;
      }

      setCurrentPage(1);
      setLastPage(Math.ceil(dataTemp.length / MAX_DATA_TABLE));
      setDataManipulate(dataTemp);
    },
    [search, sorting]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const openDialog = useCallback((type: FormType, user?: User) => {
    setFormType(type);
    setUserAction((prevState) => user || prevState);
    setOpenForm(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleSort = useCallback(
    (head: string) => {
      if (head !== sorting.label) {
        setSorting({
          isAscend: true,
          label: head,
        });
      } else {
        if (sorting.isAscend) {
          setSorting((prevState) => {
            return {
              ...prevState,
              isAscend: false,
            };
          });
        } else {
          setSorting({
            label: "",
            isAscend: true,
          });
        }
      }
    },
    [sorting]
  );

  const handleDeleteUser = useCallback((index: number) => {
    if (index !== -1) {
      setData((prevState) => {
        let temp = [...prevState];
        temp.splice(index, 1);
        return temp;
      });
    }
    closeDialog();
  }, []);

  const handleFormUser = useCallback(
    (user: User, index: number) => {
      if (formType === FormType.CREATE) {
        setData((prevState) => [...prevState, user]);
      }
      if (formType === FormType.UPDATE && index !== -1) {
        setData((prevState) => {
          const dataTemp = [...prevState];
          dataTemp[index] = user;
          return dataTemp;
        });
      }
      closeDialog();
    },
    [formType]
  );

  const findData = useCallback(
    (user?: User) => {
      if (user) {
        const index = data.findIndex(
          (dataUser) => dataUser.username === user.username
        );
        return index;
      }
      return -1;
    },
    [data]
  );

  const handlePage = useCallback((type: PageType) => {
    setCurrentPage(
      (prevState) => prevState + (type === PageType.NEXT ? 1 : -1)
    );
  }, []);

  useEffect(() => {
    handleManipulate(data);
  }, [data, search, sorting]);

  const renderContentDialog = useCallback(() => {
    if (userAction) {
      if (formType === FormType.DELETE) {
        return (
          <DeleteUser
            user={userAction}
            handleSubmit={() => handleDeleteUser(findData(userAction))}
            handleCancel={closeDialog}
          />
        );
      }
    }
    return (
      <FormUser
        user={userAction}
        type={formType}
        handleCancel={closeDialog}
        handleForm={(user) => handleFormUser(user, findData(userAction))}
      />
    );
  }, [formType, userAction]);

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none px-4"
        >
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Users list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all users
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                color="blue"
                size="sm"
                onClick={() => openDialog(FormType.CREATE)}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
              </Button>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={useDebounce(handleSearch, 500)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-4">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    onClick={() => handleSort(head)}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                      <ChevronSort
                        head={head}
                        index={index}
                        sorting={sorting}
                      />
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataManipulate.length > 0 &&
                arrayPaginate(dataManipulate, MAX_DATA_TABLE, currentPage).map(
                  (dummy, index) => {
                    const {
                      firstname,
                      lastname,
                      username,
                      groupAccess,
                      email,
                      expiredDate,
                    } = dummy;
                    const isLast = index === dataManipulate.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={username + index}>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {firstname}&nbsp;{lastname}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {username}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {email}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={groupAccess}
                              color={
                                groupAccess === GroupAccess.ADMIN
                                  ? "green"
                                  : "blue"
                              }
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {dateFormat(expiredDate)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Edit User">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => openDialog(FormType.UPDATE, dummy)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete User">
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => openDialog(FormType.DELETE, dummy)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-end gap-2 border-t border-blue-gray-50 p-4">
          <IconButton
            size="sm"
            variant="outlined"
            color="blue-gray"
            disabled={currentPage === 1}
            onClick={() => handlePage(PageType.PREVIOUS)}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
          <Typography color="gray" className="font-normal">
            Page <strong className="text-blue-gray-900">{currentPage}</strong>{" "}
            of <strong className="text-blue-gray-900">{lastPage}</strong>
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            color="blue-gray"
            disabled={currentPage === lastPage}
            onClick={() => handlePage(PageType.NEXT)}
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
        </CardFooter>
      </Card>
      <Dialog
        size={formType === FormType.DELETE ? "xs" : "lg"}
        open={openForm}
        handler={closeDialog}
        className={
          formType !== FormType.DELETE ? "bg-transparent shadow-none" : ""
        }
      >
        {renderContentDialog()}
      </Dialog>
    </>
  );
}
