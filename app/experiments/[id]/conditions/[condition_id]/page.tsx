import { Condition } from "@/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const tabs = [
  { name: "Setup", href: "#", current: true },
  { name: "Results", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function Page({
  params,
}: {
  params: { id: string; condition_id: string };
}) {
  return (
    <div className="min-h-full py-10">
      <header>
        <div className="flex justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Condition <em>Detail Page</em>
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pt-4 mx-12">
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-4">
              <nav
                className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
                aria-label="Tabs"
              >
                {tabs.map((tab, tabIdx) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700",
                      tabIdx === 0 ? "rounded-l-lg" : "",
                      tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                      "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10",
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    <span>{tab.name}</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        tab.current ? "bg-indigo-500" : "bg-transparent",
                        "absolute inset-x-0 bottom-0 h-0.5",
                      )}
                    />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// export default async function Page({ params }: { params: { id: string, condition_id: string } }) {
//     return (
//         <div className="min-h-full py-10 px-4 sm:px-6 lg:px-8">
//         <header>
//           <div className="flex justify-between mx-auto max-w-7xl ">
//             <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
//               Condition: <em></em>
//             </h1>
//             <Link
//               type="button"
//               href={`/experiments/${params.id}/conditions/${params.condition_id}/edit`}
//               className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               <PencilSquareIcon className="h-5 w-5 inline" />
//             </Link>
//           </div>
//         </header>
//         <main>
//         <div className="sm:hidden">
//           <label htmlFor="tabs" className="sr-only">
//             Select a tab
//           </label>
//           {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
//           <select
//             id="tabs"
//             name="tabs"
//             className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//             defaultValue={tabs.find((tab) => tab.current).name}
//           >
//             {tabs.map((tab) => (
//               <option key={tab.name}>{tab.name}</option>
//             ))}
//           </select>
//         </div>
//         <div className="hidden sm:block mx-8">
//           <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
//             {tabs.map((tab, tabIdx) => (
//               <a
//                 key={tab.name}
//                 href={tab.href}
//                 className={classNames(
//                   tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
//                   tabIdx === 0 ? 'rounded-l-lg' : '',
//                   tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
//                   'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
//                 )}
//                 aria-current={tab.current ? 'page' : undefined}
//               >
//                 <span>{tab.name}</span>
//                 <span
//                   aria-hidden="true"
//                   className={classNames(
//                     tab.current ? 'bg-indigo-500' : 'bg-transparent',
//                     'absolute inset-x-0 bottom-0 h-0.5'
//                   )}
//                 />
//               </a>
//             ))}
//           </nav>
//         </div>
//         </main>
//         </div>
//     )
// }
