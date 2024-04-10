from random import shuffle
import json
from . import chen_sonmez_designed

MATCHING_API_PAYLOAD = {
    "student_prefs": {},
    "college_prefs": {},
    "college_capacity": {},
}


def main(data=chen_sonmez_designed.CHEN_SONMEZ_2006, dump=True):
    """
    Create the payload for the matching API, based on the data in CHEN_SONMEZ_2006 by default
    Use convention school_id_{id}
    """
    for student in data["students"]:
        student_id = student["student_id"]
        student_prefs = list(
            map(
                lambda x: (x["school_id"], int(x["rank"])),
                student["truthful_preferences"],
            )
        )
        sorted_student_prefs = sorted(student_prefs, key=lambda x: x[1])
        flattened_student_prefs = [
            f"school_id_{school_id}" for school_id, _ in sorted_student_prefs
        ]
        MATCHING_API_PAYLOAD["student_prefs"][student_id] = flattened_student_prefs

    # Populate college_capacity
    for school in data["schools"]:
        school_id = f"school_id_{school['school_id']}"
        MATCHING_API_PAYLOAD["college_capacity"][school_id] = int(school["capacity"])

    # Populate college_prefs
    for school in data["schools"]:
        school_id = f"school_id_{school['school_id']}"
        # Get district students as ints:
        district_students = list(map(lambda x: int(x), school["district_students"]))
        # Get other students (total 36)
        non_district_students = [
            i for i in range(1, len(data["students"]) + 1) if i not in district_students
        ]
        # Randomly shuffle district and non-district students
        shuffle(district_students)
        shuffle(non_district_students)

        # Combine district and non-district students
        all_students = district_students + non_district_students
        MATCHING_API_PAYLOAD["college_prefs"][school_id] = list(
            map(lambda x: str(x), all_students)
        )

    if not dump:
        return MATCHING_API_PAYLOAD
    # Dump the payload to a file
    with open("matching_api_payload.json", "w") as f:
        json.dump(MATCHING_API_PAYLOAD, f)


if __name__ == "__main__":
    main()
