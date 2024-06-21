import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;
const dbPath = path.resolve(__dirname, 'db.json');

console.log(dbPath)
// Middleware to parse JSON bodies
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  res.send(true);
});

app.post('/submit', (req: Request, res: Response) => {
    try {
      const { name, email, phone, github_link, stopwatch_time } = req.body;
  
      if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).send('Missing required fields');
      }
  
      const newSubmission = { name, email, phone, github_link, stopwatch_time };
      let submissions = [];
  
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        if (data.trim() !== '') {
          submissions = JSON.parse(data);
        }
      }
  
      submissions.push(newSubmission);
      fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
  
      res.send('Submission saved successfully');
    } catch (err) {
      console.error('Error processing submission:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/count', (req: Request, res: Response) => {
    if (!fs.existsSync(dbPath)) {
      return res.status(404).send('No submissions found');
    }
  
    const data = fs.readFileSync(dbPath, 'utf8');
    const submissions = JSON.parse(data);
  
    res.send({ count: submissions.length });
  });

  app.delete('/delete', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);
  
    if (isNaN(index)) {
      return res.status(400).send('Invalid index');
    }
  
    if (!fs.existsSync(dbPath)) {
      return res.status(404).send('No submissions found');
    }
  
    const data = fs.readFileSync(dbPath, 'utf8');
    let submissions = [];
  
    if (data.trim() !== '') {
      submissions = JSON.parse(data);
    }
  
    if (index < 0 || index >= submissions.length) {
      return res.status(404).send('Submission not found');
    }
  
    submissions.splice(index, 1); // Remove the submission at the specified index
    fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
  
    res.send('Submission deleted successfully');
  });
  
  
  
  
// app.post('/submit', (req: Request, res: Response) => {
//   const { name, email, phone, github_link, stopwatch_time } = req.body;

//   if (!name || !email || !phone || !github_link || !stopwatch_time) {
//     return res.status(400).send('Missing required fields');
//   }

//   const newSubmission = { name, email, phone, github_link, stopwatch_time };
//   let submissions = [];

//   if (fs.existsSync(dbPath)) {
//     const data = fs.readFileSync(dbPath, 'utf8');
//     submissions = JSON.parse(data);
//   }

//   submissions.push(newSubmission);
//   fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));

//   res.send('Submission saved successfully');
// });

app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);
  
    if (isNaN(index)) {
      return res.status(400).send('Invalid index');
    }
  
    if (!fs.existsSync(dbPath)) {
      return res.status(404).send('No submissions found');
    }
  
    const data = fs.readFileSync(dbPath, 'utf8');
    let submissions = [];
  
    if (data.trim() !== '') {
      submissions = JSON.parse(data);
    }
  
    if (index < 0 || index >= submissions.length) {
      return res.status(404).send('Submission not found');
    }
  
    res.send(submissions[index]);
  });
  
// app.get('/read', (req: Request, res: Response) => {
//   const index = parseInt(req.query.index as string, 10);

//   if (isNaN(index)) {
//     return res.status(400).send('Invalid index');
//   }

//   if (!fs.existsSync(dbPath)) {
//     return res.status(404).send('No submissions found');
//   }

//   const data = fs.readFileSync(dbPath, 'utf8');
//   const submissions = JSON.parse(data);

//   if (index < 0 || index >= submissions.length) {
//     return res.status(404).send('Submission not found');
//   }

//   res.send(submissions[index]);
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
