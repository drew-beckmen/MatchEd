"""
    Script to transform data from MongoDB collection to CSV, which can be used for further analysis in R/Python.
    Secrets injected via Doppler CLI (make sure to run doppler setup first)
    Usage: doppler run -- python3 extract.py <id>
    Author: Drew Beckmen
"""

import csv
from os import environ as env
import argparse
from bson.objectid import ObjectId
from pymongo import MongoClient

MONGO_CLIENT = MongoClient(env.get("MONGO_URI"))
DB = MONGO_CLIENT["matched-prod"]
COLLECTION = DB["conditions"]


def get_students_query(obj_id):
    return [
        {"$match": {"_id": ObjectId(obj_id)}},
        {"$unwind": "$students"},
        {
            "$project": {
                "_id": 0,
                "student_id": "$students.student_id",
                "submitted_order": "$students.submitted_order",
                "truthful_preferences": "$students.truthful_preferences",
            }
        },
        {"$unwind": "$truthful_preferences"},
        {
            "$project": {
                "student_id": {"$toInt": "$student_id"},
                "school_id": {"$toInt": "$truthful_preferences.school_id"},
                "truthful_rank": "$truthful_preferences.rank",
                "payoff": "$truthful_preferences.payoff",
                "submitted_order": 1,
            }
        },
        {
            "$project": {
                "submitted_rank": {
                    "$arrayElemAt": ["$submitted_order", {"$toInt": "$school_id"}]
                },
                "truthful_rank": 1,
                "student_id": 1,
                "school_id": 1,
                "payoff": 1,
            }
        },
    ]


def get_students_district_school_map_query(obj_id):
    return [
        {"$match": {"_id": ObjectId(obj_id)}},
        {"$unwind": "$schools"},
        {"$unwind": "$schools.district_students"},
        {
            "$project": {
                "_id": 0,
                "school_id": "$schools.school_id",
                "student_id": "$schools.district_students",
            }
        },
    ]


def save_students(cursor, obj_id: str):
    students = list(
        DB.conditions.aggregate(get_students_query(obj_id), allowDiskUse=True)
    )

    # CSV Headers
    fieldnames = list(students[0].keys())
    fieldnames.append("is_district")

    # Enrich with district_school data
    district_schools = get_students_district_school_map_query(obj_id)
    district_schools = list(
        DB.conditions.aggregate(district_schools, allowDiskUse=True)
    )
    print(district_schools[:5])

    for idx, student in enumerate(students):
        student["is_district"] = (
            int(district_schools[idx // 7]["school_id"]) == student["school_id"]
        )

    with open(f"condition_{obj_id}.csv", "w") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(students)

    print(f"Saved {len(students) / 7} students to {cursor['name']}.csv")


def find_export_condition(id: str):
    query = {"_id": ObjectId(id)}
    cursor = COLLECTION.find_one(query)
    if cursor is None:
        print(f"No document found with ID {id}")
        return
    save_students(cursor, id)


def main():
    parser = argparse.ArgumentParser(
        description="Query MatchEd MongoDB collection and save results to CSV."
    )
    parser.add_argument(
        "id", help="ID of the document in the condition collection to query in MongoDB"
    )
    args = parser.parse_args()
    find_export_condition(args.id)


if __name__ == "__main__":
    main()
