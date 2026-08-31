# import instaloader

# # 1. Initialize Instaloader
# L = instaloader.Instaloader()

# # (Optional) Log in if you need to fetch data from private accounts or avoid rate limits
# # L.login('your_username', 'your_password')

# # 2. Specify the shortcode from the post URL
# SHORTCODE = "Da3Jm7rSNq-"  # Replace with actual shortcode

# # 3. Load the post object
# post = instaloader.Post.from_shortcode(L.context, SHORTCODE)

# # 4. Access engagement metrics
# print(f"Post URL: https://www.instagram.com/p/{post.shortcode}/")
# print(f"Caption: {post.caption}")
# print(f"Likes: {post.likes}")
# print(f"Comments (Reviews Count): {post.comments}")

# for c in post.get_comments():
#     print(f"Comment by {c.owner.username}: {c.text}")

# # Video views will return None for photo posts
# if post.is_video:
#     print(f"Video View Count: {post.video_view_count}")
# else:
#     print("This post is not a video.")


import instaloader
from dotenv import load_dotenv
import os

load_dotenv('backend/.env')

# 1. Initialize Instaloader
L = instaloader.Instaloader()

# (Optional) Log in if you need to fetch data from private accounts or avoid rate limits
# L.login(os.getenv('INSTAGRAM_USERNAME'), os.getenv('INSTAGRAM_PASSWORD'))

# 2. Specify the shortcode from the post URL
SHORTCODE = "DcdDszkjWpf"  # Replace with actual shortcode

# 3. Load the post object
post = instaloader.Post.from_shortcode(L.context, SHORTCODE)

# 4. Access engagement metrics
print(f"Post URL: https://www.instagram.com/p/{post.shortcode}/")
print(f"Caption: {post.caption}")
print(f"Likes: {post.likes}")
print(f"Comments (Reviews Count): {post.comments}")
# post.get_comments()

# for c in post.get_comments():
#     print(f"Comment by {c.owner.username}: {c.text}")

# Video views will return None for photo posts
if post.is_video:
    print(f"Video View Count: {post.video_view_count}")
else:
    print("This post is not a video.")