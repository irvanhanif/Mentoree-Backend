const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4500;

const routerMentee = require('./api/mentee/mentee.router');
const routerMentor = require('./api/mentor/mentor.router');
const routerSubject = require('./api/subject/subject.router');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("its work");
});

app.use('/mentee', routerMentee);
app.use('/mentor', routerMentor);
app.use('/subject', routerSubject);

app.listen(port, () => {
    console.log(`its work at port ${port}`);
});