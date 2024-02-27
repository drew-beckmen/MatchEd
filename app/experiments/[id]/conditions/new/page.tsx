'use client'

import Link from 'next/link'
import { useState } from 'react'
import MultiSelectDropdown  from '@/components/MultiSelectDropdown'

export default function Page({ params }: { params: { id: string } }) {

    const [numStudents, setNumStudents] = useState(0)
    const [numSchools, setNumSchools] = useState(0)
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="py-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 mb-4">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">New Condition</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Not ready to create an experimental condition? <Link href="/experiments/[id]" as={`/experiments/${params.id}`} className="font-semibold text-indigo-600 hover:text-indigo-500">Go back.</Link>
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="pl-2.5 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Arm 1"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="participant_instructions" className="block text-sm font-medium leading-6 text-gray-900">
                  Participant Instructions
                </label>
                <div className="mt-2">
                  <textarea
                    id="participant_instructions"
                    name="participant_instructions"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">These instructions will be provided to experimental participants before they can play the game.</p>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="num_participants" className="block text-sm font-medium leading-6 text-gray-900">
                  Number of Participants
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="num_participants"
                    id="num_participants"
                    onChange={(e) => setNumStudents(parseInt(e.target.value))}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="num_schools" className="block text-sm font-medium leading-6 text-gray-900">
                  Number of Schools
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="num_schools"
                    id="num_schools"
                    onChange={(e) => setNumSchools(parseInt(e.target.value))}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="algo" className="block text-sm font-medium leading-6 text-gray-900">
                  Matching Algorithm
                </label>
                <div className="mt-2">
                  <select
                    id="algo"
                    name="algo"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>Deferred Acceptance</option>
                    <option>Immediate Acceptance</option>
                    <option>Top Trading Cycles</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="practice_mode" className="block text-sm font-medium leading-6 text-gray-900">
                  Practice Mode
                </label>
                <div className="mt-2">
                    <select
                        id="practice_mode"
                        name="practice_mode"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                    <option>None</option>
                    <option>Repeat 10 vs. Random</option>
                    <option>Repeat 20 vs. Random</option>
                    <option>Repeat 10 vs. Optimal</option>
                    <option>Repeat 20 vs. Optimal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Students</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Specify preference ordering and payoffs for each possible matching. CSV uploads coming in subsequent version.</p>
        </div>
        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            {numStudents > 0 && numSchools > 0 ? (Array.from({ length: numStudents }, (_, i) => i)).map((student, i) => {
                return (
                    <>
                <p className='text-md mb-2 font-medium leading-6 text-gray-700 mt-2'>{`Student #${i + 1}`}</p>
                {Array.from({ length: numSchools }, (_, i) => i).map((school, j) => {
                    return (
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                            School Number
                            </label>
                            <div className="mt-2">
                            <input
                                type="number"
                                disabled
                                value={j + 1}
                                className="block w-full rounded-md border-0 py-1.5 pl-2.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-100"
                            />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="pref-rank" className="block text-sm font-medium leading-6 text-gray-900">
                            Preference Rank
                            </label>
                            <div className="mt-2">
                            <input
                                type="number"
                                name="pref-rank"
                                id="pref-rank"
                                min={1}
                                max={numSchools}
                                className="block w-full rounded-md border-0 py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="payoff" className="block text-sm font-medium leading-6 text-gray-900">
                            Payoff
                            </label>
                            <div className="mt-2">
                            <input
                                type="number"
                                name="payoff"
                                id="payoff"
                                min={0}
                                className="block w-full rounded-md border-0 py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </div>
                    </div>
                )})}
            </>
        )}) : 
            <p className="text-sm leading-6 text-gray-600">Please specify a non-zero number of students and schools first.</p>
        }
        </div>
        </form>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Schools</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Specify the name of each school, the capacity, the quality, and its list of district students. Experimental design follows the general model established by <em>Chen and Sonmez (2006)</em>.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
          {numStudents > 0 && numSchools > 0 ? (Array.from({ length: numStudents }, (_, i) => i)).map((student, i) => {
                return (
                    <>
                <p className='text-md mb-2 font-medium leading-6 text-gray-700 mt-2'>{`School #${i + 1}`}</p>
                {Array.from({ length: numSchools }, (_, i) => i).map((school, j) => {
                    return (
                        <>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                            Name
                            </label>
                            <div className="mt-2">
                            <input
                                type="text"
                                value={j + 1}
                                className="block w-full rounded-md border-0 py-1.5 pl-2.5 mb-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="capacity" className="block text-sm font-medium leading-6 text-gray-900">
                            Capacity
                            </label>
                            <div className="mt-2">
                            <input
                                type="number"
                                name="capacity"
                                id="capacity"
                                min={1}
                                max={numStudents}
                                className="block w-full rounded-md border-0 py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </div>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                <label htmlFor="quality" className="block text-sm font-medium leading-6 text-gray-900">
                  School Quality
                </label>
                <div className="mt-2">
                    <select
                        id="quality"
                        name="quality"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="capacity" className="block text-sm font-medium leading-6 text-gray-900">
                        District Students
                        </label>
                        <MultiSelectDropdown
                            formFieldName={"district students"}
                            options={Array.from({ length }, (_, index) => index + 1)}
                            onChange={(selectedCountries: string) => {
                            console.debug("selectedCountries", selectedCountries);
                            }}
                            prompt="Select students"
                        />
                    </div>
                </div>
                </>
                )})}
            </>
        )}) : 
            <p className="text-sm leading-6 text-gray-600">Please specify a non-zero number of students and schools first.</p>
        }
        </div>
          <div className="flex items-center bg-gray-100 justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 mt-2.5 sm:px-8">
            <Link href="/experiments/[id]" as={`/experiments/${params.id}`} type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
