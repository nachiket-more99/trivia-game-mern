from pymongo.mongo_client import MongoClient

uri = "mongodb://database:27017/triviagame_app"

client = MongoClient(uri)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.triviagame_app
collection_name = db["leaderboard"]

def seed_collection():
    count = collection_name.count_documents({})
    if count == 0:
        data = [
            {"username": "user-test@gmail.com", "correct_answers": 4, "date": "2025-10-01", "time_seconds": 145},
            {"username": "email@email.com", "correct_answers": 5, "date": "2025-10-01", "time_seconds": 112}
        ]
        collection_name.insert_many(data)
        print("Leaderboard seeded!")
    else:
        print("Leaderboard already has data, skipping seed.")

seed_collection()