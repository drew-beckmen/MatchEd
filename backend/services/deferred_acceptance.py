"""
    This module contains the code related to outputting the results of the deferred acceptance algorithm.
    Schema of data passed to algorithm inspired by MatchingTools API (which is no longer functional): https://matchingtools.com/swagger-ui/#!/HRI/hri_demo 
    Leveraging the matching python package
"""
import json
from matching.games import HospitalResident
from matching import MultipleMatching


def solve_matching(data: dict) -> MultipleMatching:
    game = HospitalResident.create_from_dictionaries(
        data["student_prefs"], data["college_prefs"], data["college_capacity"]
    )
    solution = game.solve(optimal="resident")
    return solution

# ======== TEST PROGRAM TO VALIDATE THE PACKAGE'S IMPLEMENTATION ===========
def main():
    # Read in the data
    with open("../data/matching_api_payload.json", "r") as f:
        data = json.load(f)

    # Create the game
    game = HospitalResident.create_from_dictionaries(
        data["student_prefs"], data["college_prefs"], data["college_capacity"]
    )
    solution = game.solve(optimal="resident")

    # Check status
    print(game.check_stability(), game.check_validity())

    # Print the results
    for school, students in solution.items():
        print(f"{school} (Admitted Students {len(students)} / Capacity {school.capacity}): Student IDs {students}")

if __name__ == "__main__":
    main()
# ===========================================================================