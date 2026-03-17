# Mayank Bhati - Portfolio

Personal portfolio website. Deploy for **free** in under 2 minutes.

## Deploy Options

### Option 1: GitHub Pages (Simplest)

1. Create a new GitHub repo (e.g. `mayank-bhati.github.io` or `portfolio`)
2. Push `index.html` and `styles.css` to the **root** of the repo
3. Go to **Settings → Pages**
4. Under "Source", select **Deploy from a branch**
5. Branch: `main`, Folder: `/ (root)`
6. Save — your site will be live at:
   - `https://mayank-bhati.github.io` (if repo is `mayank-bhati.github.io`)
   - `https://mayank-bhati.github.io/portfolio` (if repo is `portfolio`)

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Drag & drop the `portfolio` folder onto Netlify
3. Done — you get a URL like `random-name.netlify.app`
4. Optional: Add custom domain in Site settings

### Option 3: Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Import your GitHub repo or upload the folder
3. Deploy — you get a URL like `portfolio-xxx.vercel.app`

## Local Preview

Open `index.html` in a browser, or run:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit http://localhost:8000
