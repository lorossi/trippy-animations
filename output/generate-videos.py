import os
import shutil
import subprocess
import logging

first_frame_duration = 1
last_frame_duration = 5
fps = 60
source = "frames"
videos_dir = "videos"
h264_videos_dir = "h264"
gifs_dir = "gifs"
completed = 0

logging.basicConfig(level=logging.INFO, filename="generate-videos.log", filemode="w+", format='%(asctime)s %(levelname)s %(message)s')

logging.info("Creating folders")
if not os.path.exists(videos_dir):
    os.makedirs(videos_dir)
if not os.path.exists(h264_videos_dir):
    os.makedirs(h264_videos_dir)
if not os.path.exists(gifs_dir):
    os.makedirs(gifs_dir)

logging.info("Listing file")
dirs = os.listdir(source)
for dir in dirs:
    logging.info(f"Started conversion for folder {dir}")

    # LIST OF FILES
    files = os.listdir(f"{source}/{dir}")

    # create video
    options = f"ffmpeg -y -r {fps} -i {source}/{dir}/%07d.png -loop 0 {videos_dir}/{dir}.mp4"
    subprocess.run(options.split(" "))
    logging.info("mp4 video created")

    # create h264 video
    options = f"ffmpeg -y -r {fps} -i {source}/{dir}/%07d.png -c:a aac -b:a 256k -ar 44100 -c:v libx264 -pix_fmt yuv420p -r {fps} {h264_videos_dir}/{dir}_h264.mp4"
    subprocess.run(options.split(" "))
    logging.info("h264 video created")

    # create gif
    options = f"ffmpeg -y -i {videos_dir}/{dir}.mp4 -loop 0 -filter_complex fps=25,scale=500:-1,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse {gifs_dir}/{dir}.gif"
    subprocess.run(options.split(" "))
    logging.info("gif video created")

    logging.info(f"Completed folder {dir}! Folder {completed + 1}/{len(dirs)}")
    completed += 1

logging.info("Removing temp folder")
logging.info("Everything completed")
