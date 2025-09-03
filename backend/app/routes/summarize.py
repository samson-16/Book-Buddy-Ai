import os
import tempfile
from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import traceback
from app.services import pdf_utils, hf_summarizer, supabase_client
from app.utils.text_utils import chunk_text
import asyncio

router = APIRouter()

@router.post("/file")
async def summarize_file(
    file: UploadFile = File(...),
    title: str = Form("Untitled Book"),
):
    """
    Receives a PDF file, extracts text, summarizes it, and stores it.
    """
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Extract text from the PDF
        text = pdf_utils.extract_text_from_pdf(tmp_path)
    finally:
        # Clean up the temporary file
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

    # Proceed with processing and handle runtime errors so they return JSON
    try:
        # Chunk the text
        chunks = chunk_text(text)
        print(f"extracted text length={len(text)}; chunks={len(chunks)}")

        # Summarize each chunk asynchronously
        summaries = await asyncio.gather(*[hf_summarizer.summarize_text(chunk) for chunk in chunks])

        # Combine summaries
        final_summary = " ".join(summaries)
        print(f"summaries_count={len(summaries)}; sample={summaries[:1]}")

        # Store in Supabase
        book_id = supabase_client.insert_book(title, None)
        supabase_client.insert_summary(book_id, final_summary, summary_type="medium")

        return {"summary": final_summary}
    except Exception as e:
        # Print full traceback to logs and return a JSON error so CORS headers are applied
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})