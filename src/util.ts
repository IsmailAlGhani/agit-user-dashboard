import { GroupAccess, User } from "./types";
import { useEffect, useRef } from "react";

export const MAX_DATA_TABLE = 5;

export const TABLE_HEAD = [
  "Fullname",
  "Username",
  "Email",
  "Group Access",
  "Expired Date",
  "Actions",
];

export const DUMMY_USERS: User[] = [
  {
    firstname: "Test",
    lastname: "Aja",
    username: "test_Aja",
    password: "Test@aja",
    confirmPassword: "Test@aja",
    email: "testAja@mail.com",
    expiredDate: new Date(),
    groupAccess: GroupAccess.ADMIN,
  },
];

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any[]) => void;
/**
 *
 * @param func The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */

export function useDebounce<Func extends SomeFunction>(
  func: Func,
  delay = 1000
) {
  const timer = useRef<Timer>();

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);
    clearTimeout(timer.current);
    timer.current = newTimer;
  }) as Func;

  return debouncedFunction;
}

export function datetimeLocal(datetime: Date) {
  const dt = new Date(datetime);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0, 16);
}

export function arrayPaginate(
  array: User[],
  page_size: number,
  page_number: number
) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export function dateFormat(date: Date) {
  let options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  return new Intl.DateTimeFormat("id", options).format(date);
}
