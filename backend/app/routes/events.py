from fastapi import APIRouter, HTTPException
from app.database import get_connection

router = APIRouter()


@router.get("/registration-deadline")
def get_registration_deadline():

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name,
            registration_deadline
        FROM events
        WHERE id = 1
        LIMIT 1
    """)

    event = cursor.fetchone()

    cursor.close()
    connection.close()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return {
        "event_id": event["id"],
        "event_name": event["name"],
        "registration_deadline": event["registration_deadline"]
    }