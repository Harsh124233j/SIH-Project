//For the first time to clone repo to local machine
git clone https://github.com/Harsh124233j/SIH-Project.git

//then make a new branch before adding any code (it ensures main branch remains safe)
git checkout -b newBranchName (without "")

//add any file or make any changes to code then
git add .
git commit -m "message" (do write message to let others know of the work)

//to merge with main branch
git push origin branchName (without "")
//this will create a pull request
//after reviewing we will merge with the main branch

//agar main branch mai koi changes hue hai aur usse apne branch me bhi add krne ke liye  
git pull origin main

// for safety just keep a local copy of code on your local machine
// also add comments in your code so that others can understand
//Hello  Aryan
//Hello Kavyansh
//hi