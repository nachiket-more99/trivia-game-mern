def record_serializer(record) -> dict:
    return {
        "id": str(record["_id"]),
        "username": record["username"],
        "correct_answers": record["correct_answers"],
        "date": record["date"],
        "time_seconds": record.get("time_seconds", None)
    }

def records_serializer(records) -> list:
    return [record_serializer(record) for record in records]