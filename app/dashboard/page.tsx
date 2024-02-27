import Link from "next/link";
import { fetchData } from "@/app/actions";
import { Experiment } from "@/types";
import { PlusIcon } from "@heroicons/react/20/solid";

function convertUTCToLocalTimeString(utcTimeString: string) {
  const utcDate = new Date(utcTimeString);

  // Format the date with local time
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  const localTimeString = new Intl.DateTimeFormat("en-US", options).format(
    utcDate,
  );

  return localTimeString;
}

export default async function Dashboard() {
  const experimentData: Experiment[] = await fetchData("/api/experiments");
  return (
    <>
      <div className="min-h-full">
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                Dashboard
              </h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8">
              <div className="pt-4">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                      Experiments
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                      Here are all of the experiments you've created on MatchEd.
                      You can edit existing experiments or create new ones.
                    </p>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                      type="button"
                      href="/experiments/new"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add experiment
                    </Link>
                  </div>
                </div>
                <div className="mt-8 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {experimentData.length > 0 ? (
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Number of Trials
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Created At
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Last Updated
                                </th>
                                <th
                                  scope="col"
                                  className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                >
                                  <span className="sr-only">Edit</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {experimentData.map((experiment) => (
                                <tr key={experiment._id}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    <Link
                                      href={`/experiments/${experiment._id}`}
                                    >
                                      {experiment.name}
                                    </Link>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {experiment.condition_ids.length}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {convertUTCToLocalTimeString(
                                      experiment.created_at as string,
                                    )}{" "}
                                    UTC
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {convertUTCToLocalTimeString(
                                      experiment.last_updated as string,
                                    )}{" "}
                                    UTC
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <a
                                      href="#"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Edit
                                      <span className="sr-only">
                                        , {experiment.name}
                                      </span>
                                    </a>
                                    <a
                                      href="#"
                                      className="ml-6 text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                      <span className="sr-only">
                                        , {experiment.name}
                                      </span>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center py-12">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                              />
                            </svg>
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                              No experiments
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Get started by creating a new experiment.
                            </p>
                            <div className="mt-6">
                              <Link
                                type="button"
                                href="/experiments/new"
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                <PlusIcon
                                  className="-ml-0.5 mr-1.5 h-5 w-5"
                                  aria-hidden="true"
                                />
                                New Experiment
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
