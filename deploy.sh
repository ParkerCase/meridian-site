#!/bin/bash

# MeridianAI Product Site Deployment Script

set -e

print_status() {
    echo -e "\033[0;34m[DEPLOY]\033[0m $1"
}

print_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Check if dist directory exists
if [ -d "dist" ]; then
    rm -rf dist
fi

mkdir dist

print_status "Building production site..."

# Copy all files except development files
rsync -av --exclude='node_modules' --exclude='.git' --exclude='deploy.sh' --exclude='setup.sh' --exclude='*.md' . dist/

print_status "Optimizing files..."

# Minify CSS (if you have a minifier)
# uglifyjs css/main.css -o dist/css/main.css

# Minify JS (if you have a minifier)
# uglifyjs js/main.js -o dist/js/main.js

print_success "Site built successfully in dist/ directory"

# Optional: Deploy to various hosting services
echo ""
echo "Deployment options:"
echo "1. Upload dist/ folder to your web server"
echo "2. Deploy to Netlify: netlify deploy --prod --dir dist"
echo "3. Deploy to Vercel: vercel dist --prod"
echo "4. Deploy to GitHub Pages: Copy dist/ contents to gh-pages branch"
echo ""

print_success "Ready for deployment!"
