from fastapi import APIRouter
from config.database import collection_name
from models.leaderboard_model import Leaderboard
from schemas.leaderboard_schema import record_serializer, records_serializer
from bson import ObjectId

leaderboard_app_router = APIRouter()

#GET all
@leaderboard_app_router.get("/")
async def get_records():
    records = records_serializer(
        collection_name.find().sort([("correct_answers", -1), ("time_seconds", 1)])
    )
    return {"status": "ok", "data": records}

#GET by id
@leaderboard_app_router.get("/{id}")
async def get_record(id: str):
    return record_serializer(collection_name.find_one({"_id": ObjectId(id)}))

#CREATE record
@leaderboard_app_router.post("/")
async def post_record(record: Leaderboard):
    existing = collection_name.find_one({"username": record.username})
    
    if existing is None:
        _id = collection_name.insert_one(dict(record))
        new_record = record_serializer(collection_name.find_one({"_id": _id.inserted_id}))
        return {"status": "ok", "data": new_record}
    
    existing_score = existing.get("correct_answers", 0)
    existing_time = existing.get("time_seconds", None)
    new_score = record.correct_answers
    new_time = record.time_seconds

    is_better = (new_score > existing_score) or \
                (new_score == existing_score and new_time is not None and 
                 (existing_time is None or new_time < existing_time))

    if is_better:
        collection_name.find_one_and_update(
            {"username": record.username},
            {"$set": dict(record)}
        )
        updated = record_serializer(collection_name.find_one({"username": record.username}))
        return {"status": "ok", "data": updated}
    
    return {"status": "ok", "data": record_serializer(existing)}

@leaderboard_app_router.put('/{id}')
async def update_record(id:str, record: Leaderboard):
    collection_name.find_one_and_update({"_id":ObjectId(id)},{
        "$set":dict(record)
    })
    updated_record = record_serializer(collection_name.find_one({"_id": ObjectId(id)}))
    return {"status": "ok", "data": updated_record}


@leaderboard_app_router.delete("/{id}")
async def delete_record(id: str, record: Leaderboard):
    deleted_record =  record_serializer(collection_name.find_one_and_delete({"_id":ObjectId(id)}))
    return {"status": "ok", "data": deleted_record}







