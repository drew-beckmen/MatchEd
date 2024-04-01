"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Student } from "@/types";

const tabData = ["Truthful", "Reported"];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ResultsDialog({
  isOpen,
  setOpen,
  student,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  student: Student | null;
}) {
  const tabs = tabData.map((tab) => <option key={tab}>{tab}</option>);
  const [currentTab, setCurrentTab] = useState(tabData[0]);
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <InformationCircleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Participant {student?.participant_id}
                    </Dialog.Title>
                    <div className="mt-2">
                      <div>
                        <div className="sm:hidden">
                          <label htmlFor="tabs" className="sr-only">
                            Select a tab
                          </label>
                          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                          <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            defaultValue={currentTab}
                            onChange={(event) =>
                              setCurrentTab(
                                event.target.value as typeof currentTab,
                              )
                            }
                          >
                            {tabs}
                          </select>
                        </div>
                        <div className="hidden sm:block">
                          <nav className="flex space-x-4" aria-label="Tabs">
                            {tabData.map((tab) => (
                              <button
                                key={tab}
                                className={classNames(
                                  currentTab === tab
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "text-gray-500 hover:text-gray-700",
                                  "rounded-md px-3 py-2 text-sm font-medium",
                                )}
                                aria-current={currentTab ? "page" : undefined}
                                onClick={() => setCurrentTab(tab)}
                              >
                                {tab}
                              </button>
                            ))}
                          </nav>
                        </div>
                        <div>
                          {currentTab === "Truthful" ? (
                            <code className="bg-gray-100 break-words">
                              {JSON.stringify(student?.truthful_preferences)}
                            </code>
                          ) : (
                            <>
                              {student?.submitted_order ? (
                                student?.submitted_order.map((order, idx) => (
                                  <p key={idx}>
                                    <strong>School {idx}</strong>: Ranking{" "}
                                    {order}
                                  </p>
                                ))
                              ) : (
                                <>No data available</>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setOpen(false)}
                  >
                    Ok
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
