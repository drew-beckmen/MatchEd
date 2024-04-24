"""
    Script to extract practice round data for each experimental participant. Goal is to output a CSV
    that contains 1 row per student_id/practice_round combo. The other columns will be school_1_ranking through
    school_7_ranking (for a total of 9 columns)

    Usage: doppler run -- python3 extract_practice_rounds.py <condition_id>
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

def get_agg_query(id: str):
    return [
    {
        '$match': {
            '_id': ObjectId(id)
        }
    }, {
        '$unwind': '$students'
    }, {
        '$project': {
            '_id': 0, 
            'student_id': '$students.student_id', 
            'submitted_order': '$students.submitted_order', 
            'practice_rounds': '$students.practice_orderings', 
            'truthful': '$students.truthful_preferences'
        }
    }, {
        '$project': {
            'student_id': 1, 
            'submitted_order': 1, 
            'truthful': 1, 
            'practice_1': {
                '$arrayElemAt': [
                    '$practice_rounds', 0
                ]
            }, 
            'practice_2': {
                '$arrayElemAt': [
                    '$practice_rounds', 1
                ]
            }, 
            'practice_3': {
                '$arrayElemAt': [
                    '$practice_rounds', 2
                ]
            }, 
            'practice_4': {
                '$arrayElemAt': [
                    '$practice_rounds', 3
                ]
            }, 
            'practice_5': {
                '$arrayElemAt': [
                    '$practice_rounds', 4
                ]
            }
        }
    }, {
        '$project': {
            'practice_1': {
                '$map': {
                    'input': '$practice_1', 
                    'as': 'value', 
                    'in': {
                        '$add': [
                            {
                                '$toInt': '$$value'
                            }, 1
                        ]
                    }
                }
            }, 
            'practice_2': {
                '$map': {
                    'input': '$practice_2', 
                    'as': 'value', 
                    'in': {
                        '$add': [
                            {
                                '$toInt': '$$value'
                            }, 1
                        ]
                    }
                }
            }, 
            'practice_3': {
                '$map': {
                    'input': '$practice_3', 
                    'as': 'value', 
                    'in': {
                        '$add': [
                            {
                                '$toInt': '$$value'
                            }, 1
                        ]
                    }
                }
            }, 
            'practice_4': {
                '$map': {
                    'input': '$practice_4', 
                    'as': 'value', 
                    'in': {
                        '$add': [
                            {
                                '$toInt': '$$value'
                            }, 1
                        ]
                    }
                }
            }, 
            'practice_5': {
                '$map': {
                    'input': '$practice_5', 
                    'as': 'value', 
                    'in': {
                        '$add': [
                            {
                                '$toInt': '$$value'
                            }, 1
                        ]
                    }
                }
            }, 
            'submitted_order': 1, 
            'student_id': 1, 
            'truthful_rankings': {
                '$map': {
                    'input': '$truthful', 
                    'as': 'item', 
                    'in': '$$item.rank'
                }
            }
        }
    }, {
        '$addFields': {
            'practice_1_truth': {
                '$eq': [
                    '$practice_1', '$truthful_rankings'
                ]
            }, 
            'practice_2_truth': {
                '$eq': [
                    '$practice_2', '$truthful_rankings'
                ]
            }, 
            'practice_3_truth': {
                '$eq': [
                    '$practice_3', '$truthful_rankings'
                ]
            }, 
            'practice_4_truth': {
                '$eq': [
                    '$practice_4', '$truthful_rankings'
                ]
            }, 
            'practice_5_truth': {
                '$eq': [
                    '$practice_5', '$truthful_rankings'
                ]
            }, 
            'submitted_truth': {
                '$eq': [
                    '$submitted_order', '$truthful_rankings'
                ]
            }
        }
    }
]

def find_export_practice_data(id: str):
    query = get_agg_query(id)
    cursor = COLLECTION.find_one(ObjectId(id))
    if cursor is None:
        print(f"No document found with ID {id}")
        return
    students = list(
        DB.conditions.aggregate(query, allowDiskUse=True)
    )
    fieldnames = list(students[0].keys())
    with open(f"practice_data_{id}.csv", "w") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(students)

    print(f"Saved to CSV.")




def main():
    parser = argparse.ArgumentParser(
        description="Query MatchEd MongoDB collection and save results from practice rounds to CSV."
    )
    parser.add_argument(
        "id", help="ID of the document in the condition collection to query in MongoDB"
    )
    args = parser.parse_args()
    find_export_practice_data(args.id)


if __name__ == "__main__":
    main()
