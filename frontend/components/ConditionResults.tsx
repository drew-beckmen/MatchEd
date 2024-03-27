"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Condition, Student } from "@/types";
import { convertUTCToLocalTimeString } from "@/app/util";
import ResultsDialog from "@/components/ResultsDialog";
import { useState } from "react";
import Notification from "@/components/Notification";
import Link from "next/link";

const statuses = {
  true: "text-green-700 bg-green-50 ring-green-600/20",
  false: "text-red-800 bg-red-50 ring-red-600/20",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Page({ condition }: { condition: Condition }) {
  const studentData: Student[] = condition.students;
  const [isOpen, setIsOpen] = useState(false);
  const [copyNotificationIsOpen, setCopyNotificationIsOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);

  function copyToClipboard(
    participant_id: string | undefined,
    condition_id: string | undefined,
  ) {
    navigator.clipboard.writeText(
      `${window.location.href.split("/")[2]}/public/${condition_id}/${participant_id}`,
    );
    setCopyNotificationIsOpen(true);
    setTimeout(() => setCopyNotificationIsOpen(false), 3000);
  }

  return (
    <>
      <ul role="list">
        {studentData.map((student) => (
          <li
            key={student.student_id}
            className="border-b-2 flex items-center justify-between gap-x-6 py-5"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  Participant #{student.student_id}
                </p>
                <p
                  className={classNames(
                    student.is_finished ? statuses.true : statuses.false,
                    "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                  )}
                >
                  {student.is_finished ? "Finished" : "Incomplete"}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Created at{" "}
                  <time dateTime={condition.created_at}>
                    {convertUTCToLocalTimeString(
                      condition.created_at as string,
                    )}{" "}
                    UTC
                  </time>
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <button
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                onClick={() => {
                  setStudent(student);
                  setIsOpen(true);
                }}
              >
                View data
              </button>
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            copyToClipboard(
                              student.participant_id,
                              condition._id,
                            )
                          }
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900",
                          )}
                        >
                          Participant Link
                          <span className="sr-only">
                            , Student {student.student_id}
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
      <span className="flex items-center justify-end mt-6">
        <p className="text-sm text-gray-600">
          Want to download all data for this condition?&nbsp;
        </p>
        <Link
          href={`/api/experiments/${condition.experiment_id}/conditions/${condition._id}`}
          target="_blank"
          download={true}
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Click here to download as JSON.
        </Link>
      </span>
      <span className="flex items-center justify-end mt-2">
        <p className="text-sm text-gray-600">
          Once all participants say finished,&nbsp;
        </p>
        <Link
          href={`/api/experiments/${condition.experiment_id}/conditions/${condition._id}`}
          target="_blank"
          download={true}
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          click here to run the matching algorithm.
        </Link>
      </span>
      <ResultsDialog isOpen={isOpen} setOpen={setIsOpen} student={student} />
      <Notification
        show={copyNotificationIsOpen}
        setShow={setCopyNotificationIsOpen}
        title="Copied to clipboard!"
        message="Share the link with the experimental participant"
      />
    </>
  );
}
