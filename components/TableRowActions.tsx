"use client";

import { Experiment } from "../types";

type TableRowActionsProps = {
  experiment: Experiment;
};

export default function TableRowActions({ experiment }: TableRowActionsProps) {
  return (
    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
      <button
        className="text-indigo-600 hover:text-indigo-900"
      >
        Edit
        <span className="sr-only">
          , {experiment.name}
        </span>
      </button>
      <button
        className="ml-6 text-red-600 hover:text-red-900"
      >
        Delete
        <span className="sr-only">
          , {experiment.name}
        </span>
      </button>
    </td>
  );
}
