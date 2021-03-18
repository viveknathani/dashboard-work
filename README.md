# Assignment

## Setup
Create a `.env` file in `./backend` with the following values. 
1. DB_NAME=dashboard
2. JWT_SECRET=something
3. PORT=4000  
These values could be named differently too. If you change the port value to something different than 4000, make sure to edit the `proxy` field in `package.json` of `frontend`.  

## Usage
``` bash
1. sudo systemctl start mongod # or equivalent approach in your system
2. mongo # start mongodb prompt
3. use dashboard # or any DB_NAME (should match with the one used in .env file)
4. # exit from prompt
5. cd backend # from project root
6. npm install
7. npm start
8. cd frontend # from project root
8. npm install
9. npm start # will start at PORT 3000 by default
```
