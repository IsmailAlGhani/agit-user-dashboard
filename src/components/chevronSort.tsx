import { Sorting } from "../types";
import { TABLE_HEAD } from "../util";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

type ChevronProp = {
  head: string;
  index: number;
  sorting: Sorting;
};

export default function ChevronSort({ head, index, sorting }: ChevronProp) {
  if (index !== TABLE_HEAD.length - 1) {
    if (head === sorting.label) {
      if (sorting.isAscend) {
        return <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />;
      }
      return <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />;
    }
    return <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />;
  }
}
