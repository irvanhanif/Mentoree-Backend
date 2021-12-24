const express = require('express');

const app = express();
const port = process.env.PORT || 4500;

app.get('/', (req, res) => {
    res.send("its work");
});

app.listen(port, () => {
    console.log(`its work at port ${port}`);
});