from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Akaal Integrated Solutions API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    project_type: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactInquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    project_type: Optional[str] = Field(default=None, max_length=80)
    message: str = Field(min_length=5, max_length=4000)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {
        "service": "Akaal Integrated Solutions",
        "status": "online",
        "owner": "Avtar",
        "location": "Brampton, ON",
    }


@api_router.post("/contact", response_model=ContactInquiry, status_code=201)
async def create_contact_inquiry(payload: ContactInquiryCreate):
    inquiry = ContactInquiry(**payload.model_dump())
    doc = inquiry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    try:
        await db.contact_inquiries.insert_one(doc)
    except Exception as e:
        logging.exception("Failed to persist contact inquiry")
        raise HTTPException(status_code=500, detail="Could not save inquiry") from e
    return inquiry


@api_router.get("/contact", response_model=List[ContactInquiry])
async def list_contact_inquiries():
    items = (
        await db.contact_inquiries.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(500)
    )
    for it in items:
        if isinstance(it.get("created_at"), str):
            try:
                it["created_at"] = datetime.fromisoformat(it["created_at"])
            except ValueError:
                pass
    return items


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
