#!/bin/bash

# MongoDB Atlas → Local MongoDB Sync Script

# Dump from Atlas
mongodump --uri="mongodb+srv://GopikaPamisetty:g%40pi2917@cluster0.fyguyfb.mongodb.net/jobportal" --out=./dump_from_atlas

# Restore to Local MongoDB
mongorestore --db=jobportal --drop ./dump_from_atlas/jobportal

# Done!
echo "✅ Local MongoDB has been updated from Atlas!"
