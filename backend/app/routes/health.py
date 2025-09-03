from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_health():
    """
    Health check endpoint.
    """
    return {"status": "ok"}