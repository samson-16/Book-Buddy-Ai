from supabase import create_client
import os
from app.config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_book(title: str, user_id: str = None):
    data = {"title": title, "user_id": user_id}
    res = supabase.table("books").insert(data).execute()
    return res.data[0]["id"]

def insert_summary(book_id: str, summary_text: str, summary_type="medium"):
    data = {
        "book_id": book_id,
        "summary_type": summary_type,
        "summary": summary_text
    }
    res = supabase.table("summaries").insert(data).execute()
    return res.data[0]["id"]
def update_book_summary(book_id: str, final_summary: str):
    """Updates the book status to 'completed' and inserts the summary."""
    # First, insert the summary content
    insert_summary(book_id, final_summary)
    
    # Then, update the book's status
    supabase.table("books").update({"status": "completed"}).eq("id", book_id).execute()