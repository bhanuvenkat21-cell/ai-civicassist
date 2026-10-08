# GitHub setup (team leader)

1. Create a free account at github.com if needed.
2. Click New repository. Name: `JanSeva AI`. Choose Private for now (switch to Public at submission if the rules need it). Do not add a README (this folder has one).
3. In this folder run:

```
git init
git add .
git commit -m "Initial project structure"
git branch -M main
git remote add origin https://github.com/<your-username>/JanSeva AI.git
git push -u origin main
```

4. Add teammates: repository Settings -> Collaborators -> Add people, using their GitHub usernames.
5. Teammates run: `git clone https://github.com/<your-username>/JanSeva AI.git`
6. Put the spreadsheet `JanSeva AI_Services.xlsx` in the `data/` folder and push it.
