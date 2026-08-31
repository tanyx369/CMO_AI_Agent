from instagrapi import Client
from dotenv import load_dotenv
import os

cl = Client()

load_dotenv('backend/.env')

# Option A: Login with session (recommended)
# cl.load_settings("session.json")
# cl.login("YOUR_USERNAME", "YOUR_PASSWORD")

# Option B: Login directly
cl.login(os.getenv('INSTAGRAM_USERNAME'), os.getenv('INSTAGRAM_PASSWORD'))

# Get media PK from the post URL
post_url = "https://www.instagram.com/p/Da3Jm7rSNq-/"
media_pk = cl.media_pk_from_url(post_url)

# Fetch post details
media = cl.media_info(media_pk)

# Extract core engagement metrics
like_count = media.like_count
comment_count = media.comment_count
view_count = media.view_count      # For videos (returns 0 for photos)
play_count = media.play_count      # For Reels / Clips

print(f"Likes: {like_count}")
print(f"Comments: {comment_count}")
print(f"Views: {view_count}")
print(f"Reel Plays: {play_count}")